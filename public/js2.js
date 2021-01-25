var selectedFile
async function subir(){
   
    let data = new FormData();
    data.append('file', selectedFile, selectedFile.name);
    const response = await axios.post("https://gpusjoapi.herokuapp.com/upload", data, { headers:{'Content-Type': `multipart/form-data`}}).then(response => {
        console.log(response.data)
        return true
    }).catch(err => {
        console.log(err)
        document.getElementById("danger-alerts").innerHTML = '<div class="alert alert-danger" role="alert"> Error subiendo imagen</div>'
        return
    })
        if (response){
            const datos = {
                name:document.getElementById("name").value,
                memory:parseInt(document.getElementById("memory").value),
                image:selectedFile.name,
                price:parseInt(document.getElementById("price").value),
                benchmarks:[
                    parseInt( document.getElementById("0").value),
                    parseInt( document.getElementById("1").value),
                    parseInt( document.getElementById("2").value),
                    parseInt( document.getElementById("3").value),
                    parseInt( document.getElementById("4").value),
                    parseInt( document.getElementById("5").value),
                    parseInt( document.getElementById("6").value),
                    parseInt( document.getElementById("7").value),
                ],
        }
        const response2 = await axios.post("https://gpusjoapi.herokuapp.com/gpus", datos).then(response => {
            return true
        }).catch(err => {
            document.getElementById("danger-alerts").innerHTML = '<div class="alert alert-danger" role="alert"> Error subiendo datos</div>'
            console.log(err)
            return
        })
        if (response2){
            document.getElementById("danger-alerts").innerHTML = '<div class="alert alert-success" role="alert"> GPU subida correctamente </div>'
        }
    }



}
document.getElementById("imagen").onchange = () => {
    selectedFile = document.getElementById("imagen").files[0];
    console.log(selectedFile)
    document.getElementById("preview").src = window.URL.createObjectURL(selectedFile)
    }