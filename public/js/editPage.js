document.querySelector('.edit-button').addEventListener('click', (e) => {
    // Display a confirmation alert
    customAlert2(
        'Are you sure you want to save the changes?',
        function onConfirm() {
            // Perform the save action on confirmation
            changeFormMethodAndAction('POST', `/editdb/${document.getElementById('edit-form').dataset.id}/edit`);
            document.getElementById('edit-form').submit();
        },
        function onCancel() {
            // Optionally handle cancel action
            console.log('User canceled the save action.');
        }
    );
});

//* Custom Alert functions /
function customAlert2(message, onConfirm, onCancel) {
    document.getElementById('alertMessage2').textContent = message; // Updated ID

    const alertDiv = document.getElementById('customAlert2');
    alertDiv.style.display = 'block';

    alertDiv.querySelector('.ok-btn').onclick = function () {
        alertDiv.style.display = 'none';
        if (onConfirm) onConfirm();
    };

    alertDiv.querySelector('.cancel-btn').onclick = function () {
        alertDiv.style.display = 'none';
        if (onCancel) onCancel();
    };
}

function closeCustomAlert() {
    document.getElementById('customAlert2').style.display = 'none';
}
//* End of Custom Alert functions /

// changecolor for options
function changecolor(selectElement) {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    selectElement.style.color = selectedOption.style.color;
}
