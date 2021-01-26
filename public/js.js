async function login(){
    if (document.getElementById("user").value == "" || document.getElementById("pass").value == ""){
        document.getElementById("danger-alerts").innerHTML = '<div class="alert alert-danger" role="alert"> Login inválido</div>'
        return
    }
    const data = {
        user: document.getElementById("user").value,
        password: document.getElementById("pass").value
    }
    const response = await axios.post('https://gpusjoapi.herokuapp.com/login', data).then(response => {
        return response.data
    }).catch(err => {
        document.getElementById("danger-alerts").innerHTML = '<div class="alert alert-danger" role="alert"> Login inválido</div>'
        console.log(err)
        return
    })
    if (response !== undefined){
        document.getElementById("danger-alerts").innerHTML = ""
        var expires = ""
            var date = new Date();
            date.setTime(date.getTime() + (1*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        document.cookie = 'jwt' + "=" + (response.token || "")  + expires + "; path=/";
        window.location.href = '/admin';
    }
    

}