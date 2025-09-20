const selectBox = document.querySelector(".select-box"),
      modeBtnX = selectBox.querySelector(".playerX"),
      modeBtnO = selectBox.querySelector(".playerO"),
      nameInputs = document.querySelector(".name-inputs"),
      startBtn = document.getElementById("startBtn"),
      playBoard = document.querySelector(".play-board"),
      players = document.querySelector(".players"),
      allBox = document.querySelectorAll("section span"),
      resultBox = document.querySelector(".result-box"),
      wonText = resultBox.querySelector(".won-text"),
      replayBtn = resultBox.querySelector("button"),
      backBtn = document.getElementById("backBtn"),
      xScoreDisplay = document.getElementById("xScore"),
      oScoreDisplay = document.getElementById("oScore"),
      drawScoreDisplay = document.getElementById("drawScore"),
      xScoreboard = document.getElementById("xScoreboard"),
      oScoreboard = document.getElementById("oScoreboard");

let playerXIcon = "❌", playerOIcon = "⭕";
let currentPlayer = playerXIcon, runBot = false;
let playerXName = "Player X", playerOName = "Player O";
let xScore = 0, oScore = 0, drawScore = 0;
let selectedMode = "";

modeBtnX.onclick = () => { selectedMode="pvp"; nameInputs.classList.remove("hide"); };
modeBtnO.onclick = () => { selectedMode="bot"; nameInputs.classList.remove("hide"); };

startBtn.onclick = () => {
  playerXName = document.getElementById("playerXName").value || "Player X";
  playerOName = selectedMode==="bot" ? "Computer" : document.getElementById("playerOName").value || "Player O";

  xScoreboard.textContent = `${playerXName} Wins: `;
  xScoreboard.appendChild(xScoreDisplay);
  oScoreboard.textContent = `${playerOName} Wins: `;
  oScoreboard.appendChild(oScoreDisplay);

  runBot = selectedMode==="bot";
  selectBox.classList.add("hide");
  playBoard.classList.add("show");
  resetBoard();
};

allBox.forEach(box => {
  box.onclick = () => {
    if(box.innerText===""){
      placeMove(box,currentPlayer);
      if(checkWinner(currentPlayer)){ updateScore(currentPlayer); showResult(currentPlayer); return; }
      else if(isDraw()){ drawScore++; drawScoreDisplay.textContent=drawScore; showResult("Draw"); return; }

      currentPlayer = currentPlayer===playerXIcon ? playerOIcon : playerXIcon;
      players.classList.toggle("active");

      if(runBot && currentPlayer===playerOIcon){ setTimeout(smartBot,300); }
    }
  };
});

function placeMove(box,player){
  box.innerText=player;
  box.classList.add("bounce");
  setTimeout(()=>box.classList.remove("bounce"),300);
  box.style.pointerEvents="none";
}

function smartBot(){
  let move = findBestMove();
  if(move!==null){ placeMove(allBox[move],playerOIcon); }
  if(checkWinner(playerOIcon)){ updateScore(playerOIcon); showResult(playerOIcon); return; }
  else if(isDraw()){ drawScore++; drawScoreDisplay.textContent=drawScore; showResult("Draw"); return; }

  currentPlayer = playerXIcon;
  players.classList.toggle("active");
}

function findBestMove(){
  let emptyBoxes=[];
  allBox.forEach((box,i)=>{ if(box.innerText==="") emptyBoxes.push(i); });

  for(let i of emptyBoxes){ allBox[i].innerText=playerOIcon; if(checkWinner(playerOIcon)){ allBox[i].innerText=""; return i; } allBox[i].innerText=""; }
  for(let i of emptyBoxes){ allBox[i].innerText=playerXIcon; if(checkWinner(playerXIcon)){ allBox[i].innerText=""; return i; } allBox[i].innerText=""; }
  if(emptyBoxes.includes(4)) return 4;
  const corners=[0,2,6,8].filter(i=>emptyBoxes.includes(i));
  if(corners.length) return corners[Math.floor(Math.random()*corners.length)];
  return emptyBoxes[Math.floor(Math.random()*emptyBoxes.length)];
}

function checkWinner(player){
  const winPatterns=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  return winPatterns.some(pattern => pattern.every(index=>allBox[index].innerText===player));
}

function isDraw(){ return [...allBox].every(box=>box.innerText!==""); }

function updateScore(player){
  if(player===playerXIcon){ xScore++; xScoreDisplay.textContent=xScore; }
  else if(player===playerOIcon){ oScore++; oScoreDisplay.textContent=oScore; }
}

function showResult(player){
  setTimeout(()=>{
    playBoard.classList.remove("show");
    resultBox.classList.add("show");
    if(player==="Draw"){ wonText.innerHTML="It's a <p>Draw</p>!"; }
    else { let name=player===playerXIcon?playerXName:playerOName; wonText.innerHTML=`<p>${name}</p> won the game!`; }
  },500);
}

replayBtn.onclick=()=>{
  resetBoard();
  playBoard.classList.add("show");
  resultBox.classList.remove("show");
};

backBtn.onclick = ()=>{
  resetBoard();
  playBoard.classList.remove("show");
  resultBox.classList.remove("show");
  selectBox.classList.remove("hide");
};

function resetBoard(){
  allBox.forEach(box=>{ box.innerText=""; box.style.pointerEvents="auto"; });
  currentPlayer = playerXIcon;
  players.classList.add("active");
}
