function changeFormMethodAndAction(method, action) {
    const form = document.querySelector('#edit-form');
    
    if (!form) {
        console.error('Form with id "edit-form" not found!');
        return;
    }

    form.method = method;
    form.action = action;
    form.submit();
}