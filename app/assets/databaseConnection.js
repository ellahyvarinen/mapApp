'use strict';

function sendDataToMongoDB() {

    var placeName = $('#formName').val();
    var note = $('#formDescription').val();

    console.log('Place name: ' + placeName);
    console.log('Note: ' + note);

    $.ajax({
        url: "https://docs.google.com/forms/d/18ymLe_gWmaHiEZKYUxnVmGB5ItKqc4fOeum1EEpGj1Y/formResponse",
        type: "POST",
        dataType: "xml",
        data: {
            "entry.1550552479": placeName,
            "entry.1866528485": note
        }
    });
}