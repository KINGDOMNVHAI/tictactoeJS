/* =============== Khởi tạo - Constructor =============== */

var player = 1; // Kiểm tra hiện đến lượt ai - Check turn

// Khai báo thẻ canvas để vẽ - Declare canvas to draw
var canvas = document.getElementById("board");
// The HTMLCanvasElement.getContext() method returns a drawing context on the canvas, or null if the context identifier is not supported.
// Phương thức getContext() trả về định nghĩa để vẽ trên canvas, hoặc null nếu định nghĩa đó không được hỗ trợ
var context = canvas.getContext('2d');

// Kích thước bàn cờ - Board size
var canvasSize = 750; // Kích thước tối đa của bàn cờ - max size of board
var numberOfSquare = 10; // Số ô - number of square
var sectionSize = 70; // Kích thước mỗi ô - size of square
canvas.width = canvasSize; // Chiều dài bàn cờ - Width of board
canvas.height = canvasSize; // Chiều rộng bàn cờ - Height of board

// Số quân để thắng - number of pieces to win
var numberOfPiecesToWin = 5;

// Màu sắc - Color of X and O
var colorX = '#0000FF';
var colorO = '#FF0000';

// Cắm cờ kiểm tra thắng chưa. Thắng rồi thì thôi không chơi nữa
// Flag to check win or not. winFlag = true, game is stopped
var winFlag = false;

/* =============== Draw =============== */

/**
 * Vẽ bàn cờ - Draw a board
 * Chiều dọc chiều ngang có số ô bằng với numberOfSquare. Tối đa là 14x14, tối thiểu là 5x5
 * Width and Height have max number of Square is 14x14, min is 5x5
 */

function drawBoard(numberOfSquare)
{
    if (numberOfSquare <= 14)
    {
        for (i=0;i<=numberOfSquare;i++)
        {
            for (j=0;j<=numberOfSquare;j++)
            {
                // Đường ngang - Width
                context.moveTo(0,sectionSize*j); // Di chuyển đến vị trí x,y - Move to x,y position

                // Vẽ từ vị trí moveTo đến vị trí lineTo tạo thành 1 đường thẳng
                // Draw the line from moveTo(x,y) position to lineTo(x,y) position
                context.lineTo(sectionSize*numberOfSquare,sectionSize*j);
                context.stroke();

                // Đường dọc - Height
                context.moveTo(sectionSize*i,0);
                context.lineTo(sectionSize*i,sectionSize*numberOfSquare);
                context.stroke();
            }
        }
    }
    else
    {
        alert("max number of Square is 14x14, min is 5x5");
    }
}

drawBoard(numberOfSquare);
