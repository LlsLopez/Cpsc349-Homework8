// as explained in the submission file, I did NOT run this in vscode, rather an external source
// I also used outside sources for the initial design of the grid due to lack of experience
//( I used my own 2d array / win check logic, etc)
class App extends React.Component{
  constructor()
  {
    super();
    this.state = {
      p1:1,
      p2:2,
      playerTurn:1,
      gameOver:0,
      gameBoard: []
    };
    this.takeTurn = this.takeTurn.bind(this);
  }
  
  
  // 2d array 7x6
  createBoard()
  {
    let gameBoard = []; 
    for(let i = 0; i < 6; i++) 
      {
        gameBoard[i] = [];
        for(let j = 0; j < 7; j++)
          {
            gameBoard[i][j]= 0; // (unfilled)
          }
      }
    
    this.setState({
      gameBoard,
      playerTurn:this.state.p1,
      gameOver : 0,
      msg:"Welcome to Connect 4"
    });
  }
  
  determinePlayerTurn()
  {
    if(this.state.playerTurn == 1)
      {
        this.setState({playerTurn: 2})
      }
    else if(this.state.playerTurn == 2)
      {
        this.setState({playerTurn:1})
      }
  }
  
  takeTurn(Cselection) {
    if(this.state.gameOver == 0) // white the game is not over
      {
        let gBoard = this.state.gameBoard;
        let cont = true;
        for(let i = 5; i > -1; i--) // decrementing to reverse placement of cells (otherwise spawn at top)
          {
            if(gBoard[i][Cselection] == 0 && cont == true)
              {
                gBoard[i][Cselection] = this.state.playerTurn;
                cont = false;
              } // end if
          } // end for
      } // end if
    
    // determine if game has come to an end
           let status = 0;
    // horizontal check
    let gBoard = this.state.gameBoard;
    for(let i = 0; i < 6; i++) // checking 6 rows
      {
        for(let j = 0; j < 4; j++)  //checking column matches
          {
            if(gBoard[i][j] != 0)
              {
                if(gBoard[i][j] == gBoard[i][j+1] && gBoard[i][j] == gBoard[i][j+2] && gBoard[i][j] == gBoard[i][j+3])
                  {
                    status = 1; // horizontal win
                  }
              }
          }
      }
    
    // verticle check
     for(let i = 6; i >= 0; i--) // checking 7 columns (backwards)
      {
        for(let j = 5; j >= 3; j--)  //checking rows matching
          {
            if(gBoard[j][i] != 0)
              {
                if(gBoard[j][i] == gBoard[j-1][i] && gBoard[j][i] == gBoard[j-2][i] && gBoard[j][i] == gBoard[j-3][i])
                  {
                    status = 2; // vertical win
                  }
              }
          }
      }
    
    // diagonal check
    
    // towars the rigtht
    for(let i = 5; i >= 3; i--) // rows
      {
        for(let j = 0; j < 4; j++) // columns  - cap at 3, not possible on col4+
          {
            if(gBoard[i][j] != 0) // if cell is filled
              {
                if(gBoard[i][j] == gBoard[i-1][j+1] &&
                   gBoard[i][j] == gBoard[i-2][j+2] &&
                   gBoard[i][j] == gBoard[i-3][j+3]
                  )
                  {
                  status = 3; // diagonal win
                  }
              }
          }
      }
      
        
        // towards the left
    for(let i = 5; i >= 3; i--) // rows
      {
        for(let j = 6; j >= 3; j--) // columns  - cap at 3, not possible on col 2-
          {
            if(gBoard[i][j] != 0) // if cell is filled
              {
                if(gBoard[i][j] == gBoard[i-1][j-1] &&
                   gBoard[i][j] == gBoard[i-2][j-2] &&
                   gBoard[i][j] == gBoard[i-3][j-3]
                  )
                  {
                  status = 3; // diagonal win - purposely same number as previous
                  }
              }
          }
      }
    
    // draw check
    // logic: will check if someone has won, if not check for a draw by seeing if any empty spaces left.
    let checker = false; // determines if an empty spot has been found
    if(status == 0) // if a player has NOT won yet
      {
        for(let i = 5; i >= 0; i--) // rows
          {
            for(let j = 0; j < 7; j++)
              {
                if(gBoard[i][j] == 0) // if empty spot is detected
                  {
                    checker = true;
                  }
              }
          }
        if(checker == false)
          {
            status = 4; // draw
          }
      }
    
    
    if(status > 0 && status < 5) // if there is a clear winner / draw
      {
        if(this.state.playerTurn == 1)
          {
            this.setState({
              gBoard,
              gameOver:1,
              msg: "Red Wins!"
              
            })
          }
        else if(this.state.playerTurn == 2)
          {
            this.setState({
              gBoard,
              gameOver:1,
              msg: "Yellow Wins!"
            })
          }
          
       if(status == 4)
          {
            this.setState({
              gBoard,
              gameOver:1,
              msg: "draw"
            })
          }

      }
    
    
    this.determinePlayerTurn(); // alternates between the player every turn
    
    
    
    // end of end game check
    
    
  }// end takeTurn
  
  // warned against this by several sites (outdated)
  componentWillMount() {
    this.createBoard();
  }
   
  render(){
    return(
          <div>
        <table>
          <thead>
          </thead>
          <tbody>
            {this.state.gameBoard.map((row, i) => (<Row key={i} row={row} takeTurn={this.takeTurn} />))}
          </tbody>
        </table>
                
        <div className="msg">{this.state.msg}</div>
        <div className="button" onClick={() => {this.createBoard()}}>RESTART GAME</div>
        
      </div>

    ); // end of return
  } // end of render
  
}

  const Row = ({row,takeTurn}) => {
    return(
      <tr>
       {row.map((cell,i) => <Cell key={i} player = {cell} index = {i} takeTurn = {takeTurn} /> )}
         </tr>
    );
  };

  const Cell = ({player,index,takeTurn}) => {
    let color = "white"; // default color
    if(player == 1)
      {
        color = "red";
      }
    else if(player == 2) {
      color = "yellow";
    }
         return (
    <td> 
        <div className = "cell" onClick = {() => {takeTurn(index)}}>
          <div className = {color}> </div> </div> 
      </td>
    );  
  }; // end of react function
      

ReactDOM.render(<App />, document.getElementById('board'));