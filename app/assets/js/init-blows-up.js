var blowup_nodes = document.getElementsByClassName('list-group-image');
if (blowup_nodes) {
    [].forEach.call(blowup_nodes, function (el) {
        $(el).blowup();
    })
}