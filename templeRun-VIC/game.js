(function () {
    "use strict";

    const stage = document.getElementById("game-stage");
    const player = document.getElementById("player");
    const obstaclesLayer = document.getElementById("obstacles");
    const btnLeft = document.getElementById("btn-left");
    const btnRight = document.getElementById("btn-right");
    const overlay = document.getElementById("overlay");
    const btnRestart = document.getElementById("btn-restart");

    const LANES = 2;
    const BASE_SPAWN_Y = -18;
    /** Debe coincidir con `.player { height }` en styles.css (porcentaje del escenario). */
    const PLAYER_HEIGHT_PCT = 22;
    /** Mínimo |Δy| entre obstáculos de carriles distintos: 1.5× altura del personaje. */
    const MIN_CROSS_LANE_Y_GAP = 1.5 * PLAYER_HEIGHT_PCT;
    /** Extra aleatorio encima del mínimo cuando salen dos a la vez. */
    const DUAL_STAGGER_EXTRA_MAX = 12;

    let currentLane = 0;
    let obstacles = [];
    let running = true;
    let lastTs = 0;
    let spawnAccumulator = 0;
    let nextSpawnMs = 600 + Math.random() * 400;
    let rafId = 0;

    const BASE_SPEED_PCT_PER_SEC = 38;
    let speedMultiplier = 1;

    function laneCenterPercent(lane) {
        return (lane + 0.5) * (100 / LANES);
    }

    function setLane(lane) {
        currentLane = Math.max(0, Math.min(LANES - 1, lane));
        player.setAttribute("data-lane", String(currentLane));
    }

    function moveLeft() {
        if (!running) return;
        setLane(currentLane - 1);
    }

    function moveRight() {
        if (!running) return;
        setLane(currentLane + 1);
    }

    function clearObstaclesDom() {
        obstaclesLayer.innerHTML = "";
        obstacles = [];
    }

    /** True si `yPct` respeta la separación mínima respecto a todos los obstáculos del otro carril. */
    function otherLaneVerticalGapOk(lane, yPct) {
        for (const obs of obstacles) {
            if (obs.lane === lane) continue;
            if (Math.abs(obs.yPct - yPct) < MIN_CROSS_LANE_Y_GAP) return false;
        }
        return true;
    }

    /** Busca un `top` % válido para un carril, desplazando el spawn hacia arriba si hace falta. */
    function findYForLane(lane) {
        for (let bump = 0; bump < 30; bump++) {
            const y = BASE_SPAWN_Y - bump * 5;
            if (otherLaneVerticalGapOk(lane, y)) return y;
        }
        return null;
    }

    /**
     * Posiciones para doble spawn: |y0 - y1| >= MIN_CROSS_LANE_Y_GAP y sin conflicto con obstáculos existentes.
     */
    function findDualSpawnYs() {
        const stagger =
            MIN_CROSS_LANE_Y_GAP + Math.random() * DUAL_STAGGER_EXTRA_MAX;
        for (let bump = 0; bump < 24; bump++) {
            const yHi = BASE_SPAWN_Y - bump * 6;
            const yLo = yHi - stagger;
            const swap = Math.random() < 0.5;
            const y0 = swap ? yLo : yHi;
            const y1 = swap ? yHi : yLo;
            if (otherLaneVerticalGapOk(0, y0) && otherLaneVerticalGapOk(1, y1)) {
                return [y0, y1];
            }
        }
        return null;
    }

    function spawnRow() {
        const patterns = [
            [true, false],
            [false, true],
            [true, true],
            [false, false],
        ];
        const weights = [0.28, 0.28, 0.18, 0.26];
        let r = Math.random();
        let idx = 0;
        for (let i = 0; i < weights.length; i++) {
            r -= weights[i];
            if (r <= 0) {
                idx = i;
                break;
            }
        }
        let pattern = patterns[idx].slice();
        const yForLane = [null, null];

        if (pattern[0] && pattern[1]) {
            const pair = findDualSpawnYs();
            if (pair) {
                yForLane[0] = pair[0];
                yForLane[1] = pair[1];
            } else {
                pattern = [false, false];
                const lane = Math.random() < 0.5 ? 0 : 1;
                const y = findYForLane(lane);
                if (y !== null) {
                    pattern[lane] = true;
                    yForLane[lane] = y;
                }
            }
        } else {
            for (let lane = 0; lane < LANES; lane++) {
                if (!pattern[lane]) continue;
                const y = findYForLane(lane);
                if (y === null) {
                    pattern[lane] = false;
                } else {
                    yForLane[lane] = y;
                }
            }
        }

        for (let lane = 0; lane < LANES; lane++) {
            if (!pattern[lane] || yForLane[lane] === null) continue;
            const yPct = yForLane[lane];
            const el = document.createElement("div");
            el.className = "obstacle";
            el.style.left = laneCenterPercent(lane) + "%";
            el.style.top = yPct + "%";
            el.style.transform = "translate(-50%, 0)";
            obstaclesLayer.appendChild(el);
            obstacles.push({
                lane,
                yPct,
                el,
            });
        }
    }

    function rectsOverlap(a, b) {
        return (
            a.left < b.right &&
            a.right > b.left &&
            a.top < b.bottom &&
            a.bottom > b.top
        );
    }

    function getPlayerRect() {
        const pr = player.getBoundingClientRect();
        const sr = stage.getBoundingClientRect();
        const body = player.querySelector(".player-body");
        const br = body ? body.getBoundingClientRect() : pr;
        return {
            left: ((br.left - sr.left) / sr.width) * 100,
            right: ((br.right - sr.left) / sr.width) * 100,
            top: ((br.top - sr.top) / sr.height) * 100,
            bottom: ((br.bottom - sr.top) / sr.height) * 100,
        };
    }

    function getObstacleRect(obs) {
        const sr = stage.getBoundingClientRect();
        const r = obs.el.getBoundingClientRect();
        return {
            left: ((r.left - sr.left) / sr.width) * 100,
            right: ((r.right - sr.left) / sr.width) * 100,
            top: ((r.top - sr.top) / sr.height) * 100,
            bottom: ((r.bottom - sr.top) / sr.height) * 100,
        };
    }

    function checkCollisions() {
        const p = getPlayerRect();
        const margin = 1.2;
        const playerHit = {
            left: p.left + margin,
            right: p.right - margin,
            top: p.top + margin,
            bottom: p.bottom - margin * 2,
        };

        for (const obs of obstacles) {
            if (obs.lane !== currentLane) continue;
            const o = getObstacleRect(obs);
            if (rectsOverlap(playerHit, o)) return true;
        }
        return false;
    }

    function gameOver() {
        running = false;
        cancelAnimationFrame(rafId);
        overlay.classList.remove("hidden");
        btnRestart.focus();
    }

    function resetGame() {
        overlay.classList.add("hidden");
        clearObstaclesDom();
        setLane(0);
        running = true;
        lastTs = 0;
        spawnAccumulator = 0;
        nextSpawnMs = 600 + Math.random() * 400;
        speedMultiplier = 1;
        loop(performance.now());
    }

    function loop(ts) {
        if (!running) return;
        if (!lastTs) lastTs = ts;
        const dt = Math.min((ts - lastTs) / 1000, 0.05);
        lastTs = ts;

        speedMultiplier = Math.min(speedMultiplier + dt * 0.015, 1.65);

        const speed = BASE_SPEED_PCT_PER_SEC * speedMultiplier;
        spawnAccumulator += dt * 1000;
        if (spawnAccumulator >= nextSpawnMs) {
            spawnAccumulator = 0;
            nextSpawnMs = 520 + Math.random() * 420;
            spawnRow();
        }

        obstacles = obstacles.filter((obs) => {
            obs.yPct += speed * dt;
            obs.el.style.top = obs.yPct + "%";
            if (obs.yPct > 110) {
                obs.el.remove();
                return false;
            }
            return true;
        });

        if (checkCollisions()) {
            gameOver();
            return;
        }

        rafId = requestAnimationFrame(loop);
    }

    btnLeft.addEventListener("click", moveLeft);
    btnRight.addEventListener("click", moveRight);
    btnRestart.addEventListener("click", resetGame);

    document.addEventListener("keydown", (e) => {
        if (!running && e.key !== "Enter") return;
        if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
            e.preventDefault();
            moveLeft();
        } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
            e.preventDefault();
            moveRight();
        }
    });

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            /* no cerrar al tocar fuera: solo botón */
        }
    });

    requestAnimationFrame(loop);
})();
