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
                // Đường ngang
                context.moveTo(0,sectionSize*j); // Di chuyển đến vị trí x,y - Move to x,y position

                // Vẽ từ vị trí moveTo đến vị trí lineTo tạo thành 1 đường thẳng
                // Draw the line from moveTo(x,y) position to lineTo(x,y) position
                context.lineTo(sectionSize*numberOfSquare,sectionSize*j);
                context.stroke();

                // Đường dọc
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





// ====== Video 2 ====== // 

// Step 1: event click and get position

document.getElementById("board").addEventListener("click", getPositionClick);

// https://www.w3schools.com/jsref/met_element_addeventlistener.asp

function getPositionClick(event){

    // Return the size of an element and its position relative to the viewport.
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    var rect = canvas.getBoundingClientRect(); 

    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    console.log(x,y);
    
    addPlayingPiece(x,y); 
}

// Step 2: draw the pieces X O on position

// After click, draw the pieces X O on position

/**
 * Vẽ dấu O và X - draw X and O
 * xCordinate, yCordinate là vị trí click vào màn hình, canvas board
 * xCordinate, yCordinate is position you click on screen, on canvas board
 */
function drawO(xCordinate, yCordinate)
{
    context.beginPath(); // context is object to draw

    // arc(centerX, centerY, radius, startAngle, endAngle);
    // Draw the circle
    context.arc(xCordinate,yCordinate, 25, 0, Math.PI * 2); 

    // Draw the point in center of circle. Point to check win or not
    context.moveTo(xCordinate, yCordinate);
    context.arc(xCordinate, yCordinate, 1, 0, Math.PI * 2, true); 

    context.lineWidth=3; // Width of circle
    context.strokeStyle = colorO; // Color of circle
    context.stroke();
}

function drawX(xCordinate, yCordinate)
{
    context.beginPath(); // context is object to draw

    context.moveTo(xCordinate - 20, yCordinate - 20); // from position you click, move to left down
    context.lineTo(xCordinate + 20, yCordinate + 20); // Line from left to right, down to up

    context.moveTo(xCordinate + 20, yCordinate - 20); // from position you click, move to left up
    context.lineTo(xCordinate - 20, yCordinate + 20); // Line from left to right, up to down 
    context.lineWidth = 5;
    context.strokeStyle = colorX; // Color of circle
    context.stroke();
}

// You need the function to call in getPositionClick

function addPlayingPiece(clickX,clickY) // clickX,clickY your position click
{
    if (winFlag == false)
    {
        var xCordinate, yCordinate;

        // Vòng lặp kiểm tra từng ô X - Loop to check each square up to down
        for (var x = 0;x < numberOfSquare;x++)
        {
            // Vòng lặp kiểm tra từng ô Y - Loop to check each square left to right
            for (var y = 0;y < numberOfSquare;y++)
            {
                // Xác định tọa độ từng ô - check position of square
                xCordinate = x * sectionSize;
                yCordinate = y * sectionSize;

                // Nếu click đúng vào vị trí của ô đó thì vẽ X hoặc O - This is check your click on square. Your click must have position in this square
                if (clickX > xCordinate && clickX < xCordinate + sectionSize &&
                    clickY > yCordinate && clickY < yCordinate + sectionSize)
                {
                    // Tính toán vị trí cho đúng tâm ô vuông để vẽ - Find the center of square
                    xCordinate = xCordinate + (sectionSize / 2);
                    yCordinate = yCordinate + (sectionSize / 2);

                    // Kiểm tra vị trí xCordinate, yCordinate có màu gì khác ngoài màu trắng.
                    // Dùng console.log(pixelData); để xem mảng xuất ra
                    // Check color of X and O
                    var pixelData = context.getImageData(xCordinate, yCordinate, 1, 1).data;

                    // Nếu mảng xuất ra là [0,0,0,0] nghĩa là chỗ đó là màu trắng
                    // If pixelData is [0,0,0,0]. This is White
                    if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 0))
                    {
                        // If player 1 clicked, draw X
                        if (player % 2 == 1)
                        {
                            drawX(xCordinate,yCordinate);
                            player++;
                            // checkWinRow(xCordinate,yCordinate,colorX);
                            // checkWinColumn(xCordinate,yCordinate,colorX);
                            // checkWinDiagonalLeftToRight(xCordinate,yCordinate,colorX);
                            // checkWinDiagonalRightToLeft(xCordinate,yCordinate,colorX);
                        }
                        // If player 2 clicked, draw O
                        else
                        {
                            drawO(xCordinate,yCordinate);
                            player++;
                            // checkWinRow(xCordinate,yCordinate,colorO);
                            // checkWinColumn(xCordinate,yCordinate,colorO);
                            // checkWinDiagonalLeftToRight(xCordinate,yCordinate,colorO);
                            // checkWinDiagonalRightToLeft(xCordinate,yCordinate,colorO);
                        }
                    }
                }
            }
        }
    }
    else
    {
        alert("Thắng rồi, không chơi nữa - Win! Don't have to play.");
    }
}