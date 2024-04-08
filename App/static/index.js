// Index UI
document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('file-input');
    const dropZone = document.getElementById('drop-zone');

    // const container = document.getElementById('image-upload-container');
    const wrapper = document.getElementById('wrapper');
    // const rect = document.getElementById('rectangle');
    // var img = document.createElement("img");

    var rect = document.createElement("div");
    rect.id = "rectangle";
    rect.className = "rectangle";


    let dragEnabled = true;
    let startX, startY, draw = false;


    dropZone.addEventListener('click', function () {
        fileInput.click();
    });

    fileInput.addEventListener('change', function (event) {
        if (event.target.files.length > 0) {
            handleFile(event.target.files[0]);
        }
    });


    dropZone.addEventListener('dragover', function (event) {
        event.preventDefault();
    });

    dropZone.addEventListener('drop', function (event) {
        event.preventDefault();
        if (event.dataTransfer.files.length) {
        const droppedFile = event.dataTransfer.files[0];
        fileInput.files = event.dataTransfer.files;
        fileInput.dispatchEvent(new Event('change')); // Trigger change event
    }
    });

    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            console.log('Not an image file');
            return;
        }

        var img = document.createElement("img");
        img.id = "image-container"
        img.classList.add("obj", "img-uploaded");
        img.file = file;

        // var rect = document.createElement("div");
        // rect.id = "rectangle";
        // rect.className = "rectangle";


        var reader = new FileReader();
        reader.onload = function (e) {
            img.src = e.target.result;

            var uploadContainer = document.getElementById('image-upload-container');
            uploadContainer.innerHTML = '';
            uploadContainer.appendChild(img);
            uploadContainer.appendChild(rect);

            var imgContainer = document.getElementById("image-container");

            enableRectangleDrawing(imgContainer);


            document.getElementById('filter-buttons').style.display = 'block';
            // document.getElementById('image-upload-container').style.userSelect = 'none';
            // document.getElementById('image-upload-container').style.pointerEvents = 'none';
        };
        reader.readAsDataURL(file);
    }

    // Drag button
    document.getElementById('grabcut-btn').addEventListener('click', function () {
        dragEnabled = !dragEnabled;
        this.textContent = dragEnabled ? 'GrabCut : OFF' : 'GrabCut : ON';
    });

    // Drag Function

    function enableRectangleDrawing(imgContainer) {

        imgContainer.onmousedown = (e) => {
            if (dragEnabled) return; // Skip if drag is enabled

            e.preventDefault();
            startX = Math.round(e.clientX);
            startY = Math.round(e.clientY);

            rect.style.width = '0px';
            rect.style.height = '0px';
            rect.style.left = startX + 'px';
            rect.style.top = startY + 'px';
            rect.style.display = "block";
            draw = true;
        };

        imgContainer.onmousemove = (e) => {
            if (!draw || dragEnabled) return;
            e.preventDefault();

            let endX = Math.round(e.clientX);
            let endY = Math.round(e.clientY);

            // Ensure the rectangle stays within the image bounds
            // endX = Math.max(0, Math.min(img.offsetWidth, endX));
            // endY = Math.max(0, Math.min(img.offsetHeight, endY));

            let width = Math.abs(endX - startX);
            let height = Math.abs(endY - startY);

            // Adjust the position and size based on direction of drawing
            let newStartX = (endX < startX) ? endX : startX;
            let newStartY = (endY < startY) ? endY : startY;

            rect.style.width = `${width}px`;
            rect.style.height = `${height}px`;
            rect.style.left = `${newStartX}px`;
            rect.style.top = `${newStartY}px`;
        };

        imgContainer.onmouseup = () => {
            if (!draw || dragEnabled) return;
            draw = false;

            let finalEndX = Math.round(rect.style.left.replace('px', '') - imgContainer.getBoundingClientRect().left);
            let finalEndY = Math.round(rect.style.top.replace('px', '') - imgContainer.getBoundingClientRect().top);

            let finalWidth = Math.round(rect.style.width.replace('px', ''));
            let finalHeight = Math.round(rect.style.height.replace('px', ''));

            if (finalWidth < 1) finalWidth = 1;
            if (finalHeight < 1) finalHeight = 1;

            // Calculate and adjust final start and end points
            let adjustedStartX = finalEndX;
            let adjustedStartY = finalEndY;
            let adjustedEndX = adjustedStartX + finalWidth;
            let adjustedEndY = adjustedStartY + finalHeight;

            rect.style.display = "none";

            // console.log(`StartX: ${adjustedStartX}, StartY: ${adjustedStartY}, Width: ${finalWidth}, Height: ${finalHeight}`);

            grabCut(adjustedStartX, adjustedStartY, finalWidth, finalHeight);

        };
    }

    // // Initially, allow rectangle drawing
    // enableRectangleDrawing();

    // Button Functions
    function upload_Image(string) {
        if (fileInput.files.length > 0) {
            var file = fileInput.files[0];
            var formData = new FormData();
            formData.append('file', file);

            fetch(string, {
                method: 'POST',
                body: formData,
            })
                .then(response => response.blob())
                .then(blob => {
                    // Convert blob to File object
                    var newFile = new File([blob], file.name, {
                        type: blob.type,
                        lastModified: new Date().getTime(),
                    });

                    // Update the fileInput with the new file
                    var dataTransfer = new DataTransfer();
                    dataTransfer.items.add(newFile);
                    fileInput.files = dataTransfer.files;

                    // Display the processed image
                    var imgURL = URL.createObjectURL(newFile);
                    var imgElement = document.createElement('img');
                    imgElement.id = "image-container";
                    imgElement.src = imgURL;
                    var container = document.getElementById('image-upload-container');
                    container.innerHTML = ''; // Clear previous content
                    container.appendChild(imgElement); // Display the processed image
                    container.appendChild(rect)

                    var imgContainer = document.getElementById("image-container");

                    enableRectangleDrawing(imgContainer);

                    document.getElementById('download-buttons').style.display = 'block';
                })
                .catch(error => console.error('Error:', error));
        } else {
            console.log('No file selected');
        }
    }

    // Faded Function
    document.getElementById('faded-btn').addEventListener('click', function () {
        upload_Image('/process_fadedImage');

        // if (fileInput.files.length > 0) {
        //     var file = fileInput.files[0];
        //     var formData = new FormData();
        //     formData.append('file', file);
        //
        //     fetch('/process_fadedImage', {
        //         method: 'POST',
        //         body: formData,
        //     })
        //     .then(response => response.blob())
        //     .then(blob => {
        //         var imgURL = URL.createObjectURL(blob);
        //         var imgElement = document.createElement('img');
        //         imgElement.src = imgURL;
        //         var container = document.getElementById('image-upload-container');
        //         container.innerHTML = ''; // Clear previous content
        //         container.appendChild(imgElement); // Display the processed image
        //     });
        // } else {
        //     console.log('No file selected');
        // }
    });


    // Scuff Functions
    document.getElementById('scuff-btn').addEventListener('click', function () {
        upload_Image('/process_scuffImage');

        //     if (fileInput.files.length > 0) {
        //         var file = fileInput.files[0];
        //         var formData = new FormData();
        //         formData.append('file', file);
        //
        //         fetch('/process_scuffImage', {
        //             method: 'POST',
        //             body: formData,
        //         })
        //         .then(response => response.blob())
        //         .then(blob => {
        //             var imgURL = URL.createObjectURL(blob);
        //             var imgElement = document.createElement('img');
        //             imgElement.src = imgURL;
        //             var container = document.getElementById('image-upload-container');
        //             container.innerHTML = ''; // Clear previous content
        //             container.appendChild(imgElement); // Display the processed image
        //         });
        //     } else {
        //         console.log('No file selected');
        //     }
    });

    // Spot Function
    document.getElementById('spot-btn').addEventListener('click', function () {
        upload_Image('/process_spotImage');
    });


    // GrabCut Function
    function grabCut(startX, startY, width, height) {

        if (fileInput.files.length > 0) {
            var file = fileInput.files[0];
            var formData = new FormData();
            formData.append('file', file);
            formData.append('startX', startX);
            formData.append('startY', startY);
            formData.append('width', width);
            formData.append('height', height);

            fetch("/process_grabCutImage", {
                method: 'POST',
                body: formData,
            })
                .then(response => response.blob())
                .then(blob => {
                    // Convert blob to File object
                    var newFile = new File([blob], file.name, {
                        type: blob.type,
                        lastModified: new Date().getTime(),
                    });

                    // Update the fileInput with the new file
                    var dataTransfer = new DataTransfer();
                    dataTransfer.items.add(newFile);
                    fileInput.files = dataTransfer.files;

                    // Display the processed image
                    var imgURL = URL.createObjectURL(newFile);
                    var imgElement = document.createElement('img');
                    imgElement.id = "image-container";
                    imgElement.src = imgURL;
                    var container = document.getElementById('image-upload-container');
                    container.innerHTML = ''; // Clear previous content
                    container.appendChild(imgElement); // Display the processed image
                    container.appendChild(rect)

                    var imgContainer = document.getElementById("image-container");

                    enableRectangleDrawing(imgContainer);

                    document.getElementById('download-buttons').style.display = 'block';
                })
                .catch(error => console.error('Error:', error));
        } else {
            console.log('No file selected');
        }
    }

    // Download Image
    document.getElementById('download-btn').addEventListener('click', function () {
        var imgElement = document.querySelector('#image-upload-container img');
        if (imgElement) {
            // Create a temporary anchor tag to initiate download
            var downloadLink = document.createElement('a');
            downloadLink.href = imgElement.src; // Set the href to the image's URL
            downloadLink.download = "downloadedImage.jpg"; // Set the default filename for the download

            // Append to the body temporarily
            document.body.appendChild(downloadLink);

            // Trigger the download
            downloadLink.click();

            // Clean up by removing the temporary link
            document.body.removeChild(downloadLink);
        } else {
            console.log('No image found to download');
        }
    });


});
