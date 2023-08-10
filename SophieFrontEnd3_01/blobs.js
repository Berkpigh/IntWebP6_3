const fr = new FileReader()
const file = document.querySelector("input[name='images[]']").files[0]
fr.readAsArrayBuffer(file)
fr.onload = function() {
    // you can keep blob or save blob to another position
    const blob = new Blob([fr.result])

    // url for download
    const url = URL.createObjectURL(blob, {type: "image/png"});
    const a = document.createElement("a")
    a.href = url 
    a.download = "image"
    a.click()
}
// https://stackoverflow.com/questions/64736200/how-to-convert-selected-file-input-images-into-blob