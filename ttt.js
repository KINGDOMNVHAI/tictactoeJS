/**
 * Khai báo biến public
 */
var player = 1; // Số Player sẽ thay đổi để xác định đang đến lượt của ai

// Khai báo biến canvas để vẽ
var canvas = document.getElementById("background");
var context = canvas.getContext('2d');

// Kích thước bàn cờ
var canvasSize = 750; //Kích thước tối đa của bàn cờ
var numberOfSquare = 10; // Số lượng ô
var sectionSize = 70; // Kích thước 1 ô
canvas.width = canvasSize; // Bàn cờ hình vuông nên width và height bằng nhau
canvas.height = canvasSize;

// Số quân để thắng
var numberOfPieces = 5;

// Màu sắc
var colorX = '#0000FF';
var colorO = '#FF0000';

// Cờ kiểm tra thắng chưa. Thắng rồi thì không chơi nữa.
var winFlag = false;

/* ===================== Draw ===================== */

/**
 * Vẽ bàn cờ
 * Tối đa số ô là 14x14. Sai sẽ báo lỗi.
 */
function drawBoard(numberOfSquare)
{
    if (numberOfSquare <= 14)
    {
        for(i=0;i<=numberOfSquare;i++)
        {
            for(j=0;j<=numberOfSquare;j++)
            {
                // Đường ngang
                context.moveTo(0,sectionSize*j);
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
        alert ("Số ô tối đa là 14");
    }
}

// Maximum is 14
drawBoard(numberOfSquare);

/**
 * Vẽ dấu O và X
 * xCordinate, yCordinate là vị trí click vào màn hình
 */
function drawO(xCordinate, yCordinate)
{
    context.beginPath();
    // arc(centerX, centerY, radius, startAngle, endAngle);
    context.arc(xCordinate,yCordinate,25,0,2*Math.PI);
    context.moveTo(xCordinate, yCordinate);
    context.arc(xCordinate, yCordinate, 1, 0, Math.PI * 2, true);
    context.lineWidth=3;
    context.strokeStyle = colorO;
    context.stroke();
}

function drawX(xCordinate, yCordinate)
{
    context.beginPath();

    context.moveTo(xCordinate - 20, yCordinate - 20);
    context.lineTo(xCordinate + 20, yCordinate + 20);

    context.moveTo(xCordinate + 20, yCordinate - 20);
    context.lineTo(xCordinate - 20, yCordinate + 20);
    context.lineWidth = 5;
    context.strokeStyle = colorX;
    context.stroke();
}

function drawOwin(xCordinate, yCordinate)
{
    context.beginPath();
    // arc(centerX, centerY, radius, startAngle, endAngle);
    context.fillRect(xCordinate - (sectionSize / 2), yCordinate - (sectionSize / 2), sectionSize, sectionSize);
    context.arc(xCordinate,yCordinate,25,0,2*Math.PI);
    context.moveTo(xCordinate, yCordinate);
    context.arc(xCordinate, yCordinate, 1, 0, Math.PI * 2, true);
    context.lineWidth=2;
    context.strokeStyle = "#FFF";
    context.stroke();
}

function drawXwin(xCordinate, yCordinate)
{
    context.beginPath();
    context.fillRect(xCordinate - (sectionSize / 2), yCordinate - (sectionSize / 2), sectionSize, sectionSize);

    context.moveTo(xCordinate - 20, yCordinate - 20);
    context.lineTo(xCordinate + 20, yCordinate + 20);

    context.moveTo(xCordinate + 20, yCordinate - 20);
    context.lineTo(xCordinate - 20, yCordinate + 20);
    context.lineWidth=5;
    context.strokeStyle = "#FFF";
    context.stroke();
}

/* ===================== Check Position ===================== */

/**
 * Xác định vị trí click chuột bằng sự kiện click
 */
document.getElementById("background").addEventListener("click", getPositionClick);

function getPositionClick(event){
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    addPlayingPiece(x,y);
}

/**
 * Vẽ X và O vào đúng vị trí đã click
 */
function addPlayingPiece(clickX,clickY)
{
    if (winFlag == false)
    {
        var xCordinate, yCordinate;

        // Vòng lặp kiểm tra từng ô
        for (var x = 0;x < numberOfSquare;x++)
        {
            for (var y = 0;y < numberOfSquare;y++)
            {
                // Xác định tọa độ từng ô
                xCordinate = x * sectionSize;
                yCordinate = y * sectionSize;

                // Nếu click đúng vào vị trí của ô đó thì vẽ X hoặc O
                if (clickX > xCordinate && clickX < xCordinate + sectionSize &&
                    clickY > yCordinate && clickY < yCordinate + sectionSize)
                {
                    // Tính toán vị trí cho đúng tâm ô vuông để vẽ
                    xCordinate = xCordinate + (sectionSize / 2);
                    yCordinate = yCordinate + (sectionSize / 2);

                    // Kiểm tra vị trí xCordinate, yCordinate có màu gì khác ngoài màu trắng.
                    // Dùng console.log(pixelData); để xem mảng xuất ra
                    var pixelData = context.getImageData(xCordinate, yCordinate, 1, 1).data;

                    // Nếu mảng xuất ra là [0,0,0,0] nghĩa là chỗ đó là màu trắng
                    if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 0))
                    {
                        if (player % 2 == 1)
                        {
                            drawX(xCordinate,yCordinate);
                            player++;
                            checkWinRow(xCordinate,yCordinate,colorX);
                            checkWinColumn(xCordinate,yCordinate,colorX);
                            checkWinDiagonalLeftToRight(xCordinate,yCordinate,colorX);
                            checkWinDiagonalRightToLeft(xCordinate,yCordinate,colorX);
                        }
                        else
                        {
                            drawO(xCordinate,yCordinate);
                            player++;
                            checkWinRow(xCordinate,yCordinate,colorO);
                            checkWinColumn(xCordinate,yCordinate,colorO);
                            checkWinDiagonalLeftToRight(xCordinate,yCordinate,colorO);
                            checkWinDiagonalRightToLeft(xCordinate,yCordinate,colorO);
                        }
                    }
                }
            }
        }
    }
    else
    {
        alert("Thắng rồi, không chơi nữa");
    }
}

/* ===================== Check Win ===================== */

/**
 * Check win được cho vào đúng ô vừa click xong
 * Hàm này sẽ kiểm tra tất cả trường hợp thắng bắt đầu từ ô vừa click.
 * Kiểm tra bằng cách xét màu sắc.
 * Đó là lý do phải cho X và O khác màu.
 */
function checkWinRow(xCordinate,yCordinate,colorPiece)
{
    // Biến xác định vị trí các ô xung quanh
    var x;
    // Tạo mảng chứa tọa độ các ô
    var checkArray = [];

    /**
     * Hướng làm:
     * Xét bên trái, mỗi ô cùng màu cho n += 1
     * Xét bên phải cũng vậy.
     * Nếu số lượng phần tử >= 4 là thắng. (4 + ô vừa click = 5)
     * Nếu không, cho n = 0 rồi xét hàng dọc, hàng chéo tương tự
     */

    // Dựa vào màu để biết hàm này đang kiểm tra cho quân X hay O
    if (colorPiece == colorX)
    {
        // Kiểm tra 4 ô bên trái ô vừa click. (thêm ô vừa click là 5)
        for (var i = 1; i < numberOfPieces; i++)
        {
            x = xCordinate - sectionSize * i;
            // Kiểm tra màu
            var pixelData = context.getImageData(x, yCordinate, 1, 1).data;
            // Nếu mảng xuất ra là [0,0,255,255] nghĩa là chỗ đó là màu xanh của X
            if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 255) && (pixelData[3] == 255))
            {
                checkArray.push(x);
            }
        }

        x = 0;

        // Kiểm tra 4 ô bên phải ô vừa click
        for (var i = 1; i < numberOfPieces; i++)
        {
            x = xCordinate + sectionSize * i;
            // Kiểm tra màu
            var pixelData = context.getImageData(x, yCordinate, 1, 1).data;
            // Nếu mảng xuất ra là [0,0,255,255] nghĩa là chỗ đó là màu xanh của X
            if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 255) && (pixelData[3] == 255))
            {
                checkArray.push(x);
            }
        }

        // Số quân trong mảng
        if (checkArray.length + 1 >= numberOfPieces)
        {
            // Kiểm tra các phần tử có liên tiếp không
            // Đầu tiên là sắp xếp mảng
            var max;
            for (var i=1; i< checkArray.length; i++)
            {
                for (var j = checkArray.length-1; j >= i; j--)
                {
                    if (checkArray[j] < checkArray[j-1])
                    {
                        max = checkArray[j];
                        checkArray[j] = checkArray[j-1];
                        checkArray[j-1] = max;
                    }
                }
            }

            var right = 0;

            // Nếu phần tử nhỏ - phần tử lớn = sectionSize thì các quân liên tiếp nhau
            // Trường hợp mảng không nhận ô vừa click, lấy X lớn trừ X vừa click
            // Trường hợp đủ 5 ô nhưng không liên tiếp, phải lấy ô nhỏ + sectionSize = ô vừa click
            for (var i=0; i< checkArray.length; i++)
            {
                if ((checkArray[i+1] - checkArray[i] == sectionSize) ||
                ((checkArray[i+1] - xCordinate == sectionSize) && (checkArray[i] + sectionSize == xCordinate)))
                {
                    right += 1;
                }
            }

            // Ví dụ mảng có 4 phần tử + ô vừa click là 5, nghĩa là 4 lần so sánh.
            // Nếu so sánh cả 4 lần đều đúng, nghĩa là 5 phần tử liên tiếp
            if (right >= checkArray.length -1)
            {
                // Ô vừa click
                drawXwin(xCordinate,yCordinate);
                // Các ô còn lại.
                for (var i = 0; i <= checkArray.length + 1; i++)
                {
                    drawXwin(checkArray[i],yCordinate);
                }
                winFlag = true;
            }
        }
    }
    else if (colorPiece == colorO)
    {
        // Kiểm tra 4 ô bên trái ô vừa click. (thêm ô vừa click là 5)
        for (var i = 1; i < numberOfPieces; i++)
        {
            x = xCordinate - sectionSize * i;
            // Kiểm tra màu
            var pixelData = context.getImageData(x, yCordinate, 1, 1).data;
            // Nếu mảng xuất ra là [255,0,0,255] nghĩa là chỗ đó là màu đỏ của O
            if((pixelData[0] == 255) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 255))
            {
                checkArray.push(x);
            }
        }

        x = 0;

        // Kiểm tra 4 ô bên phải ô vừa click
        for (var i = 1; i < numberOfPieces; i++)
        {
            x = xCordinate + sectionSize * i;
            // Kiểm tra màu
            var pixelData = context.getImageData(x, yCordinate, 1, 1).data;
            // Nếu mảng xuất ra là [255,0,0,255] nghĩa là chỗ đó là màu đỏ của O
            if((pixelData[0] == 255) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 255))
            {
                checkArray.push(x);
            }
        }

        // Số quân trong mảng
        if (checkArray.length + 1 >= numberOfPieces)
        {
            // Kiểm tra các phần tử có liên tiếp không
            // Đầu tiên là sắp xếp mảng
            var max;
            for (var i=1; i< checkArray.length; i++)
            {
                for (var j = checkArray.length-1; j >= i; j--)
                {
                    if (checkArray[j] < checkArray[j-1])
                    {
                        max = checkArray[j];
                        checkArray[j] = checkArray[j-1];
                        checkArray[j-1] = max;
                        //console.log(max);
                    }
                }
            }

            var right = 0;

            // Nếu phần tử nhỏ - phần tử lớn = sectionSize thì các quân liên tiếp nhau
            // Trường hợp mảng không nhận ô vừa click, lấy X lớn trừ X vừa click
            // Trường hợp đủ 5 ô nhưng không liên tiếp, phải lấy ô nhỏ + sectionSize = ô vừa click
            for (var i=0; i< checkArray.length; i++)
            {
                if ((checkArray[i+1] - checkArray[i] == sectionSize) ||
                ((checkArray[i+1] - xCordinate == sectionSize) && (checkArray[i] + sectionSize == xCordinate)))
                {
                    right += 1;
                }
            }

            // Ví dụ mảng có 5 phần tử, nghĩa là 4 lần so sánh.
            // Nếu so sánh cả 4 lần đều đúng, nghĩa là 5 phần tử liên tiếp
            if (right == checkArray.length - 1)
            {
                // Ô vừa click
                drawOwin(xCordinate,yCordinate);
                // Các ô còn lại.
                for (var i = 0; i <= checkArray.length + 1; i++)
                {
                    drawOwin(checkArray[i],yCordinate);
                }
                winFlag = true;
            }
        }
    }
}

function checkWinColumn(xCordinate,yCordinate,colorPiece)
{
    var y;
    var checkArray = [];

    if (colorPiece == colorX)
    {
        // Kiểm tra 4 ô phía trên ô vừa click. (thêm ô vừa click là 5)
        for (var i = 1; i < numberOfPieces; i++)
        {
            y = yCordinate - sectionSize * i;
            var pixelData = context.getImageData(xCordinate, y, 1, 1).data;
            // Nếu mảng xuất ra là [0,0,255,255] nghĩa là chỗ đó là màu xanh của X
            if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 255) && (pixelData[3] == 255))
            {
                checkArray.push(y);
            }
        }

        y = 0;

        // Kiểm tra 4 ô phía dưới ô vừa click
        for (var i = 1; i < numberOfPieces; i++)
        {
            y = yCordinate + sectionSize * i;
            var pixelData = context.getImageData(xCordinate, y, 1, 1).data;
            // Nếu mảng xuất ra là [0,0,255,255] nghĩa là chỗ đó là màu xanh của X
            if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 255) && (pixelData[3] == 255))
            {
                checkArray.push(y);
            }
        }

        // Số quân trong mảng
        if (checkArray.length + 1 >= numberOfPieces)
        {
            // Kiểm tra các phần tử có liên tiếp không
            // Đầu tiên là sắp xếp mảng
            var max;
            for (var i=1; i< checkArray.length; i++)
            {
                for (var j = checkArray.length-1; j >= i; j--)
                {
                    if (checkArray[j] < checkArray[j-1])
                    {
                        max = checkArray[j];
                        checkArray[j] = checkArray[j-1];
                        checkArray[j-1] = max;
                    }
                }
            }

            var right = 0;

            for (var i=0; i< checkArray.length; i++)
            {
                if ((checkArray[i+1] - checkArray[i] == sectionSize) ||
                ((checkArray[i+1] - yCordinate == sectionSize) && (checkArray[i] + sectionSize == yCordinate)))
                {
                    right += 1;
                }
            }

            if (right >= checkArray.length - 1)
            {
                // Ô vừa click
                drawXwin(xCordinate,yCordinate);
                // Các ô còn lại.
                for (var i = 0; i <= checkArray.length + 1; i++)
                {
                    drawXwin(xCordinate,checkArray[i]);
                }
                winFlag = true;
            }
        }
    }
    else if (colorPiece == colorO)
    {
        // Kiểm tra 4 ô phía trên ô vừa click.
        for (var i = 1; i < numberOfPieces; i++)
        {
            y = yCordinate - sectionSize * i;
            var pixelData = context.getImageData(xCordinate, y, 1, 1).data;
            // Nếu mảng xuất ra là [255,0,0,255] nghĩa là chỗ đó là màu đỏ của O
            if((pixelData[0] == 255) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 255))
            {
                checkArray.push(y);
            }
        }

        x = 0;

        // Kiểm tra 4 ô phía dưới ô vừa click
        for (var i = 1; i < numberOfPieces; i++)
        {
            y = yCordinate + sectionSize * i;
            var pixelData = context.getImageData(xCordinate, y, 1, 1).data;
            // Nếu mảng xuất ra là [255,0,0,255] nghĩa là chỗ đó là màu đỏ của O
            if((pixelData[0] == 255) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 255))
            {
                checkArray.push(y);
            }
        }

        // Số quân trong mảng
        if (checkArray.length + 1 >= numberOfPieces)
        {
            // Kiểm tra các phần tử có liên tiếp không
            // Đầu tiên là sắp xếp mảng
            var max;
            for (var i=1; i< checkArray.length; i++)
            {
                for (var j = checkArray.length-1; j >= i; j--)
                {
                    if (checkArray[j] < checkArray[j-1])
                    {
                        max = checkArray[j];
                        checkArray[j] = checkArray[j-1];
                        checkArray[j-1] = max;
                    }
                }
            }

            var right = 0;

            for (var i=0; i< checkArray.length; i++)
            {
                if ((checkArray[i+1] - checkArray[i] == sectionSize) ||
                ((checkArray[i+1] - yCordinate == sectionSize) && (checkArray[i] + sectionSize == yCordinate)))
                {
                    right += 1;
                }
            }

            if (right >= checkArray.length - 1)
            {
                // Ô vừa click
                drawOwin(xCordinate,yCordinate);
                // Các ô còn lại.
                for (var i = 0; i <= checkArray.length + 1; i++)
                {
                    drawOwin(xCordinate,checkArray[i]);
                }
                winFlag = true;
            }
        }
    }
}

/*
* Chéo từ trái qua phải là x y cùng giảm hoặc cùng tăng
*/
function checkWinDiagonalLeftToRight(xCordinate,yCordinate,colorPiece)
{
    var x,y;
    var checkArrayX = [];
    var checkArrayY = [];
    var n = 1;

    if (colorPiece == colorX)
    {
        // Kiểm tra 4 ô chéo phía trên ô vừa click. (thêm ô vừa click là 5)
        for (var i = 1; i < numberOfPieces; i++)
        {
            x = xCordinate - sectionSize * i;
            y = yCordinate - sectionSize * i;
            var pixelData = context.getImageData(x, y, 1, 1).data;
            // Nếu mảng xuất ra là [0,0,255,255] nghĩa là chỗ đó là màu xanh của X
            if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 255) && (pixelData[3] == 255))
            {
                n += 1;
                checkArrayX.push(x);
                checkArrayY.push(y);
            }
        }

        y = 0;

        // Kiểm tra 4 ô chéo phía dưới ô vừa click
        for (var i = 1; i < numberOfPieces; i++)
        {
            x = xCordinate + sectionSize * i;
            y = yCordinate + sectionSize * i;
            var pixelData = context.getImageData(x, y, 1, 1).data;
            // Nếu mảng xuất ra là [0,0,255,255] nghĩa là chỗ đó là màu xanh của X
            if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 255) && (pixelData[3] == 255))
            {
                n += 1;
                checkArrayX.push(x);
                checkArrayY.push(y);
            }
        }

        if (n >= numberOfPieces)
        {
            // Sắp xếp mảng X
            var max;
            for (var i=1; i< checkArrayX.length; i++)
            {
                for (var j = checkArrayX.length-1; j >= i; j--)
                {
                    if (checkArrayX[j] < checkArrayX[j-1])
                    {
                        max = checkArrayX[j];
                        checkArrayX[j] = checkArrayX[j-1];
                        checkArrayX[j-1] = max;
                    }
                }
            }

            max = 0;
            // Sắp xếp mảng Y
            for (var i=1; i< checkArrayY.length; i++)
            {
                for (var j = checkArrayY.length-1; j >= i; j--)
                {
                    if (checkArrayY[j] < checkArrayY[j-1])
                    {
                        max = checkArrayY[j];
                        checkArrayY[j] = checkArrayY[j-1];
                        checkArrayY[j-1] = max;
                    }
                }
            }

            var rightX = 0;
            var rightY = 0;
            // Kiểm tra mảng X liên tiếp
            for (var i=0; i< checkArrayX.length; i++)
            {
                if ((checkArrayX[i+1] - checkArrayX[i] == sectionSize) ||
                ((checkArrayX[i+1] - xCordinate == sectionSize) && (checkArrayX[i] + sectionSize == xCordinate)))
                {
                    rightX += 1;
                }
            }

            // Kiểm tra mảng Y liên tiếp
            for (var i=0; i< checkArrayY.length; i++)
            {
                if ((checkArrayY[i+1] - checkArrayY[i] == sectionSize) ||
                ((checkArrayY[i+1] - yCordinate == sectionSize) && (checkArrayY[i] + sectionSize == yCordinate)))
                {
                    rightY += 1;
                }
            }

            if ((rightX >= checkArrayX.length - 1) && (rightY >= checkArrayY.length - 1))
            {
                // Ô vừa click
                drawXwin(xCordinate,yCordinate);
                // Các ô còn lại.
                for (var i = 0; i <= checkArrayX.length + 1; i++)
                {
                    drawXwin(checkArrayX[i],checkArrayY[i]);
                }
                winFlag = true;
            }
        }
    }
    else if (colorPiece == colorO)
    {
        // Kiểm tra 4 ô chéo phía trên ô vừa click.
        for (var i = 1; i < numberOfPieces; i++)
        {
            x = xCordinate - sectionSize * i;
            y = yCordinate - sectionSize * i;
            var pixelData = context.getImageData(x, y, 1, 1).data;
            // Nếu mảng xuất ra là [255,0,0,255] nghĩa là chỗ đó là màu đỏ của O
            if((pixelData[0] == 255) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 255))
            {
                n += 1;
                checkArrayX.push(x);
                checkArrayY.push(y);
            }
        }

        x = 0;

        // Kiểm tra 4 ô chéo phía dưới ô vừa click
        for (var i = 1; i < numberOfPieces; i++)
        {
            x = xCordinate + sectionSize * i;
            y = yCordinate + sectionSize * i;
            var pixelData = context.getImageData(x, y, 1, 1).data;
            // Nếu mảng xuất ra là [255,0,0,255] nghĩa là chỗ đó là màu đỏ của O
            if((pixelData[0] == 255) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 255))
            {
                n += 1;
                checkArrayX.push(x);
                checkArrayY.push(y);
            }
        }

        if (n >= numberOfPieces)
        {
            // Sắp xếp mảng X
            var max;
            for (var i=1; i< checkArrayX.length; i++)
            {
                for (var j = checkArrayX.length-1; j >= i; j--)
                {
                    if (checkArrayX[j] < checkArrayX[j-1])
                    {
                        max = checkArrayX[j];
                        checkArrayX[j] = checkArrayX[j-1];
                        checkArrayX[j-1] = max;
                    }
                }
            }

            max = 0;
            // Sắp xếp mảng Y
            for (var i=1; i< checkArrayY.length; i++)
            {
                for (var j = checkArrayY.length-1; j >= i; j--)
                {
                    if (checkArrayY[j] < checkArrayY[j-1])
                    {
                        max = checkArrayY[j];
                        checkArrayY[j] = checkArrayY[j-1];
                        checkArrayY[j-1] = max;
                    }
                }
            }

            var rightX = 0;
            var rightY = 0;
            // Kiểm tra mảng X liên tiếp
            for (var i=0; i< checkArrayX.length; i++)
            {
                if ((checkArrayX[i+1] - checkArrayX[i] == sectionSize) ||
                ((checkArrayX[i+1] - xCordinate == sectionSize) && (checkArrayX[i] + sectionSize == xCordinate)))
                {
                    rightX += 1;
                }
            }

            // Kiểm tra mảng Y liên tiếp
            for (var i=0; i< checkArrayY.length; i++)
            {
                if ((checkArrayY[i+1] - checkArrayY[i] == sectionSize) ||
                ((checkArrayY[i+1] - yCordinate == sectionSize) && (checkArrayY[i] + sectionSize == yCordinate)))
                {
                    rightY += 1;
                }
            }

            if ((rightX >= checkArrayX.length - 1) && (rightY >= checkArrayY.length - 1))
            {
                winFlag = true;
                // Ô vừa click
                drawOwin(xCordinate,yCordinate);
                // Các ô còn lại.
                for (var i = 0; i <= checkArrayX.length + 1; i++)
                {
                    drawOwin(checkArrayX[i],checkArrayY[i]);
                }
            }
        }
    }
}

/*
* Chéo từ phải qua trái là x tăng y giảm hoặc ngược lại
*/
function checkWinDiagonalRightToLeft(xCordinate,yCordinate,colorPiece)
{
    var x,y;
    var checkArrayX = [];
    var checkArrayY = [];
    var n = 1;

    if (colorPiece == colorX)
    {
        // Kiểm tra 4 ô chéo phía trên ô vừa click. (thêm ô vừa click là 5)
        for (var i = 1; i < numberOfPieces; i++)
        {
            x = xCordinate - sectionSize * i;
            y = yCordinate + sectionSize * i;
            var pixelData = context.getImageData(x, y, 1, 1).data;
            // Nếu mảng xuất ra là [0,0,255,255] nghĩa là chỗ đó là màu xanh của X
            if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 255) && (pixelData[3] == 255))
            {
                n += 1;
                checkArrayX.push(x);
                checkArrayY.push(y);
            }
        }

        y = 0;

        // Kiểm tra 4 ô chéo phía dưới ô vừa click
        for (var i = 1; i < numberOfPieces; i++)
        {
            x = xCordinate + sectionSize * i;
            y = yCordinate - sectionSize * i;
            var pixelData = context.getImageData(x, y, 1, 1).data;
            // Nếu mảng xuất ra là [0,0,255,255] nghĩa là chỗ đó là màu xanh của X
            if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 255) && (pixelData[3] == 255))
            {
                n += 1;
                checkArrayX.push(x);
                checkArrayY.push(y);
            }
        }

        if (n >= numberOfPieces)
        {
            // Sắp xếp mảng X tăng dần
            var max;
            for (var i=1; i< checkArrayX.length; i++)
            {
                for (var j = checkArrayX.length-1; j >= i; j--)
                {
                    if (checkArrayX[j] < checkArrayX[j-1])
                    {
                        max = checkArrayX[j];
                        checkArrayX[j] = checkArrayX[j-1];
                        checkArrayX[j-1] = max;
                    }
                }
            }

            // Sắp xếp mảng Y giảm dần
            var min;
            for (var i=1; i< checkArrayY.length; i++)
            {
                for (var j = checkArrayY.length-1; j >= i; j--)
                {
                    if (checkArrayY[j] > checkArrayY[j-1])
                    {
                        min = checkArrayY[j];
                        checkArrayY[j] = checkArrayY[j-1];
                        checkArrayY[j-1] = min;
                    }
                }
            }

            var rightX = 0;
            var rightY = 0;
            // Kiểm tra mảng X liên tiếp
            for (var i=0; i< checkArrayX.length; i++)
            {
                if ((checkArrayX[i+1] - checkArrayX[i] == sectionSize) ||
                ((checkArrayX[i+1] - xCordinate == sectionSize) && (checkArrayX[i] + sectionSize == xCordinate)))
                {
                    rightX += 1;
                }
            }

            // Kiểm tra mảng Y liên tiếp
            // Nhớ đổi lại vì Y giảm dần
            for (var i=0; i< checkArrayY.length; i++)
            {
                if ((checkArrayY[i] - checkArrayY[i+1] == sectionSize) ||
                ((checkArrayY[i] - yCordinate == sectionSize) && (checkArrayY[i+1] + sectionSize == yCordinate)))
                {
                    rightY += 1;
                }
            }

            if ((rightX >= checkArrayX.length - 1) && (rightY >= checkArrayY.length - 1))
            {
                // Ô vừa click
                drawXwin(xCordinate,yCordinate);
                // Các ô còn lại.
                for (var i = 0; i <= checkArrayX.length + 1; i++)
                {
                    drawXwin(checkArrayX[i],checkArrayY[i]);
                }
                winFlag = true;
            }
        }
    }
    else if (colorPiece == colorO)
    {
        // Kiểm tra 4 ô chéo phía trên ô vừa click.
        for (var i = 1; i < numberOfPieces; i++)
        {
            x = xCordinate - sectionSize * i;
            y = yCordinate + sectionSize * i;
            var pixelData = context.getImageData(x, y, 1, 1).data;
            // Nếu mảng xuất ra là [255,0,0,255] nghĩa là chỗ đó là màu đỏ của O
            if((pixelData[0] == 255) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 255))
            {
                n += 1;
                checkArrayX.push(x);
                checkArrayY.push(y);
            }
        }

        x = 0;

        // Kiểm tra 4 ô chéo phía dưới ô vừa click
        for (var i = 1; i < numberOfPieces; i++)
        {
            x = xCordinate + sectionSize * i;
            y = yCordinate - sectionSize * i;
            var pixelData = context.getImageData(x, y, 1, 1).data;
            // Nếu mảng xuất ra là [255,0,0,255] nghĩa là chỗ đó là màu đỏ của O
            if((pixelData[0] == 255) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 255))
            {
                n += 1;
                checkArrayX.push(x);
                checkArrayY.push(y);
            }
        }

        if (n >= numberOfPieces)
        {
            // Sắp xếp mảng X tăng dần
            var max;
            for (var i=1; i< checkArrayX.length; i++)
            {
                for (var j = checkArrayX.length-1; j >= i; j--)
                {
                    if (checkArrayX[j] < checkArrayX[j-1])
                    {
                        max = checkArrayX[j];
                        checkArrayX[j] = checkArrayX[j-1];
                        checkArrayX[j-1] = max;
                    }
                }
            }

            // Sắp xếp mảng Y giảm dần
            var min;
            for (var i=1; i< checkArrayY.length; i++)
            {
                for (var j = checkArrayY.length-1; j >= i; j--)
                {
                    if (checkArrayY[j] > checkArrayY[j-1])
                    {
                        min = checkArrayY[j];
                        checkArrayY[j] = checkArrayY[j-1];
                        checkArrayY[j-1] = min;
                    }
                }
            }

            var rightX = 0;
            var rightY = 0;
            // Kiểm tra mảng X liên tiếp
            for (var i=0; i< checkArrayX.length; i++)
            {
                if ((checkArrayX[i+1] - checkArrayX[i] == sectionSize) ||
                ((checkArrayX[i+1] - xCordinate == sectionSize) && (checkArrayX[i] + sectionSize == xCordinate)))
                {
                    rightX += 1;
                }
            }

            // Kiểm tra mảng Y liên tiếp
            // Nhớ đổi lại vì Y giảm dần
            for (var i=0; i< checkArrayY.length; i++)
            {
                if ((checkArrayY[i] - checkArrayY[i+1] == sectionSize) ||
                ((checkArrayY[i] - yCordinate == sectionSize) && (checkArrayY[i+1] + sectionSize == yCordinate)))
                {
                    rightY += 1;
                }
            }

            if ((rightX >= checkArrayX.length - 1) && (rightY >= checkArrayY.length - 1))
            {
                // Ô vừa click
                drawOwin(xCordinate,yCordinate);
                // Các ô còn lại.
                for (var i = 0; i <= checkArrayX.length + 1; i++)
                {
                    drawOwin(checkArrayX[i],checkArrayY[i]);
                }
                winFlag = true;
            }
        }
    }
}

/* ===================== New Game ===================== */

function newgame()
{
    location.reload();
}
