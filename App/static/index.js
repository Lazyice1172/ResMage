// Index UI
document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('file-input');
    const dropZone = document.getElementById('drop-zone');

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
            handleFile(event.dataTransfer.files[0]);
        }
    });

    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            console.log('Not an image file');
            return;
        }

        var img = document.createElement("img");
        img.classList.add("obj", "img-uploaded");
        img.file = file;

        var reader = new FileReader();
        reader.onload = function (e) {
            img.src = e.target.result;

            var uploadContainer = document.getElementById('image-upload-container');
            uploadContainer.innerHTML = '';
            uploadContainer.appendChild(img);

            document.getElementById('filter-buttons').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }


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
                    imgElement.src = imgURL;
                    var container = document.getElementById('image-upload-container');
                    container.innerHTML = ''; // Clear previous content
                    container.appendChild(imgElement); // Display the processed image

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


    // Spot Function
    document.getElementById('grabcut_btn').addEventListener('click', function () {
        console.log("Testing");

    });

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
