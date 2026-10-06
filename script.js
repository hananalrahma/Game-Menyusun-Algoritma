const boardSize = 6;
    const levels = [
      { name: "Mudah", start: { row: 4, col: 1, direction: 1 }, goal: { row: 1, col: 4 }, obstacles: [{ row: 2, col: 1 }, { row: 2, col: 5 }, { row: 3, col: 4 }, { row: 4, col: 4 }, { row: 5, col: 2 }, { row: 5, col: 5 }, { row: 6, col: 3 }] },
      { name: "Menengah", start: { row: 6, col: 1, direction: 0 }, goal: { row: 1, col: 6 }, obstacles: [{ row: 5, col: 1 }, { row: 5, col: 3 }, { row: 4, col: 3 }, { row: 3, col: 2 }, { row: 3, col: 5 }, { row: 2, col: 4 }, { row: 6, col: 5 }, { row: 1, col: 3 }] },
      { name: "Sulit", start: { row: 6, col: 6, direction: 3 }, goal: { row: 1, col: 1 }, obstacles: [{ row: 6, col: 4 }, { row: 5, col: 2 }, { row: 5, col: 5 }, { row: 4, col: 1 }, { row: 2, col: 4 }, { row: 3, col: 3 }, { row: 2, col: 2 }, { row: 2, col: 5 }, { row: 1, col: 3 }, { row: 3, col: 6 }] },
      { name: "Tantangan 4", start: { row: 6, col: 1, direction: 0 }, goal: { row: 1, col: 6 }, obstacles: [{ row: 5, col: 2 }, { row: 5, col: 4 }, { row: 4, col: 1 }, { row: 4, col: 5 }, { row: 3, col: 3 }, { row: 2, col: 2 }, { row: 2, col: 5 }, { row: 1, col: 4 }] },
      { name: "Tantangan 5", start: { row: 1, col: 1, direction: 1 }, goal: { row: 6, col: 6 }, obstacles: [{ row: 1, col: 3 }, { row: 2, col: 2 }, { row: 2, col: 5 }, { row: 3, col: 4 }, { row: 4, col: 1 }, { row: 4, col: 3 }, { row: 5, col: 5 }] },
      { name: "Tantangan 6", start: { row: 6, col: 6, direction: 3 }, goal: { row: 1, col: 1 }, obstacles: [{ row: 6, col: 4 }, { row: 5, col: 5 }, { row: 4, col: 3 }, { row: 3, col: 2 }, { row: 2, col: 4 }] },
      { name: "Tantangan 7", start: { row: 4, col: 1, direction: 1 }, goal: { row: 2, col: 6 }, obstacles: [{ row: 3, col: 1 }, { row: 3, col: 3 }, { row: 5, col: 2 }, { row: 5, col: 5 }, { row: 6, col: 3 }, { row: 2, col: 2 }, { row: 1, col: 5 }] },
      { name: "Tantangan 8", start: { row: 6, col: 1, direction: 0 }, goal: { row: 1, col: 5 }, obstacles: [{ row: 5, col: 3 }, { row: 4, col: 2 }, { row: 4, col: 5 }, { row: 3, col: 3 }, { row: 3, col: 6 }, { row: 2, col: 4 }, { row: 6, col: 4 }] },
      { name: "Tantangan 9", start: { row: 1, col: 6, direction: 2 }, goal: { row: 6, col: 1 }, obstacles: [{ row: 1, col: 4 }, { row: 2, col: 2 }, { row: 2, col: 5 }, { row: 3, col: 3 }, { row: 4, col: 1 }, { row: 4, col: 4 }, { row: 5, col: 2 }, { row: 5, col: 5 }] },
      { name: "Master", start: { row: 6, col: 6, direction: 3 }, goal: { row: 1, col: 1 }, obstacles: [{ row: 6, col: 4 }, { row: 5, col: 2 }, { row: 5, col: 5 }, { row: 4, col: 4 }, { row: 4, col: 2 }, { row: 3, col: 6 }, { row: 2, col: 2 }, { row: 2, col: 5 }, { row: 1, col: 3 }] }
    ];
    let currentLevel = 0;
    let startPosition = { ...levels[0].start };
    let goalPosition = { ...levels[0].goal };
    let obstacles = [...levels[0].obstacles];

    const directionIcons = ["↑", "→", "↓", "←"];
    const commands = [];
    let robot = { ...startPosition };
    let isRunning = false;
    let robotEl;

    const grid = document.getElementById("game-grid");
    const queue = document.getElementById("command-queue");
    const emptyQueue = document.getElementById("empty-queue");
    const stepCount = document.getElementById("step-count");
    const statusBox = document.getElementById("status-box");
    const statusMessage = document.getElementById("status-message");
    const nextLevelButton = document.getElementById("next-level-btn");
    const previousLevelButton = document.getElementById("previous-level-btn");
    const actionButtons = [
      document.getElementById("forward-btn"),
      document.getElementById("left-btn"),
      document.getElementById("right-btn"),
      document.getElementById("run-btn"),
      document.getElementById("undo-btn"),
      document.getElementById("reset-btn")
    ];

    function isObstacle(row, col) {
      return obstacles.some(item => item.row === row && item.col === col);
    }

    function cellId(row, col) {
      return "cell-" + row + "-" + col;
    }

    function createBoard() {
      grid.innerHTML = "";
      for (let row = 1; row <= boardSize; row++) {
        for (let col = 1; col <= boardSize; col++) {
          const cell = document.createElement("div");
          cell.className = "cell";
          cell.id = cellId(row, col);
          cell.setAttribute("role", "gridcell");
          cell.setAttribute("aria-label", "Baris " + row + ", kolom " + col);

          if (isObstacle(row, col)) {
            cell.classList.add("obstacle");
            cell.setAttribute("aria-label", "Rintangan batu, baris " + row + ", kolom " + col);
          }

          if (row === goalPosition.row && col === goalPosition.col) {
            cell.classList.add("goal");
            cell.setAttribute("aria-label", "Kristal tujuan, baris " + row + ", kolom " + col);
          }

          grid.appendChild(cell);
        }
      }

      robotEl = document.createElement("div");
      robotEl.className = "robot";
      robotEl.setAttribute("aria-label", "Robot");
      robotEl.textContent = "🤖";
      placeRobot();
    }

    function placeRobot() {
      const target = document.getElementById(cellId(robot.row, robot.col));
      if (target) {
        target.appendChild(robotEl);
        robotEl.style.transform = "rotate(" + (robot.direction * 90) + "deg)";
      }
    }

    function setStatus(message, type) {
      statusMessage.textContent = message;
      statusBox.className = "mt-5 rounded-2xl border-2 border-current px-4 py-3";
      statusBox.classList.add(type === "success" ? "status-success" : type === "error" ? "status-error" : "status-info");
    }

    function renderQueue() {
      queue.querySelectorAll(".queue-chip").forEach(chip => chip.remove());
      emptyQueue.style.display = commands.length ? "none" : "grid";

      commands.forEach((command, index) => {
        const chip = document.createElement("span");
        chip.className = "queue-chip";
        chip.setAttribute("aria-label", "Langkah " + (index + 1) + ": " + command.label);
        chip.textContent = command.symbol;
        queue.appendChild(chip);
      });

      stepCount.textContent = commands.length + (commands.length === 1 ? " langkah" : " langkah");
    }

    function addCommand(type) {
      if (isRunning) return;

      const map = {
        forward: { label: "Maju", symbol: "↑" },
        left: { label: "Belok kiri", symbol: "↶" },
        right: { label: "Belok kanan", symbol: "↷" }
      };

      commands.push({ type, ...map[type] });
      renderQueue();
      setStatus("Bagus! Tambahkan langkah lain atau jalankan algoritmamu.", "info");
    }

    function setControlsDisabled(disabled) {
      actionButtons.forEach(button => {
        button.disabled = disabled;
      });
    }

    function selectLevel(levelIndex) {
      if (isRunning) return;
      currentLevel = levelIndex;
      startPosition = { ...levels[currentLevel].start };
      goalPosition = { ...levels[currentLevel].goal };
      obstacles = [...levels[currentLevel].obstacles];
      document.getElementById("difficulty-label").textContent = levels[currentLevel].name;
      nextLevelButton.disabled = true;
      nextLevelButton.setAttribute("aria-disabled", "true");
      previousLevelButton.disabled = currentLevel === 0;
      previousLevelButton.setAttribute("aria-disabled", String(currentLevel === 0));
      Array.from({ length: levels.length }, (_, index) => index + 1).forEach((number, index) => document.getElementById("level-" + number + "-btn").setAttribute("aria-pressed", String(index === currentLevel)));
      commands.length = 0;
      robot = { ...startPosition };
      createBoard();
      renderQueue();
      setStatus("Level " + (currentLevel + 1) + " siap. Susun algoritmamu!", "info");
    }

    function resetMission(message) {
      if (isRunning) return;
      commands.length = 0;
      robot = { ...startPosition };
      placeRobot();
      renderQueue();
      nextLevelButton.disabled = true;
      nextLevelButton.setAttribute("aria-disabled", "true");
      setStatus(message || "Misi diulang. Robot kembali ke titik awal.", "info");
    }

    function showNextLevelButton() {
      if (currentLevel < levels.length - 1) {
        nextLevelButton.disabled = false;
        nextLevelButton.setAttribute("aria-disabled", "false");
      }
    }

    function nextLevel() {
      if (isRunning || nextLevelButton.disabled || currentLevel >= levels.length - 1) return;
      selectLevel(currentLevel + 1);
    }

    function undoCommand() {
      if (isRunning || commands.length === 0) return;
      commands.pop();
      renderQueue();
      setStatus("Langkah terakhir dihapus. Cek lagi algoritmamu.", "info");
    }

    function turnRobot(amount) {
      robot.direction = (robot.direction + amount + 4) % 4;
      placeRobot();
    }

    function moveRobot() {
      const delta = [
        { row: -1, col: 0 },
        { row: 0, col: 1 },
        { row: 1, col: 0 },
        { row: 0, col: -1 }
      ][robot.direction];

      const nextRow = robot.row + delta.row;
      const nextCol = robot.col + delta.col;

      if (
        nextRow < 1 ||
        nextRow > boardSize ||
        nextCol < 1 ||
        nextCol > boardSize ||
        isObstacle(nextRow, nextCol)
      ) {
        robotEl.classList.remove("bump");
        void robotEl.offsetWidth;
        robotEl.classList.add("bump");
        return false;
      }

      robot.row = nextRow;
      robot.col = nextCol;
      placeRobot();
      return true;
    }

    function reachedGoal() {
      return robot.row === goalPosition.row && robot.col === goalPosition.col;
    }

    function wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function runAlgorithm() {
      if (isRunning) return;

      if (commands.length === 0) {
        setStatus("Antrean masih kosong. Pilih instruksi untuk robot terlebih dahulu.", "error");
        return;
      }

      isRunning = true;
      setControlsDisabled(true);
      robot = { ...startPosition };
      placeRobot();
      setStatus("Robot sedang membaca algoritmamu...", "info");
      await wait(350);

      for (let index = 0; index < commands.length; index++) {
        const command = commands[index];

        if (command.type === "left") {
          turnRobot(-1);
        } else if (command.type === "right") {
          turnRobot(1);
        } else {
          const moved = moveRobot();
          if (!moved) {
            setStatus("Ups! Robot menabrak rintangan atau keluar jalur pada langkah " + (index + 1) + ". Coba debug algoritmamu.", "error");
            isRunning = false;
            setControlsDisabled(false);
            return;
          }
        }

        await wait(500);

        if (reachedGoal()) {
          setStatus("Hebat! Robot berhasil menemukan kristal. Algoritmamu bekerja! 🎉", "success");
          showNextLevelButton();
          isRunning = false;
          setControlsDisabled(false);
          return;
        }
      }

      setStatus("Robot belum sampai ke kristal. Tambahkan atau ubah langkahmu, lalu coba lagi.", "error");
      isRunning = false;
      setControlsDisabled(false);
    }

    Array.from({ length: levels.length }, (_, index) => index).forEach(index => {
      document.getElementById("level-" + (index + 1) + "-btn").addEventListener("click", () => selectLevel(index));
    });
    previousLevelButton.addEventListener("click", () => selectLevel(currentLevel - 1));
    document.getElementById("forward-btn").addEventListener("click", () => addCommand("forward"));
    document.getElementById("left-btn").addEventListener("click", () => addCommand("left"));
    document.getElementById("right-btn").addEventListener("click", () => addCommand("right"));
    document.getElementById("undo-btn").addEventListener("click", undoCommand);
    document.getElementById("reset-btn").addEventListener("click", () => resetMission());
    document.getElementById("run-btn").addEventListener("click", runAlgorithm);
    nextLevelButton.addEventListener("click", nextLevel);

    selectLevel(0);
    lucide.createIcons();
