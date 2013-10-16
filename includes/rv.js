rv = {

    tree: null,

    init: function () {
        rv.tree = $('#tree')
        rv.tree.tree({
            selectable: false,
            slide: false
        });

        $('#tree').bind(
            'tree.click',
            function (event) {
                var node = event.node;
                if (node.children.length > 0)
                    rv.tree.tree('toggle', node);
                else if (node.fullpath)
                    rv.load(node.fullpath)
            }
        );
    },

    load: function (key) {

        $('#data h1').text(key);
        $.post('/r.php?m=load', {key: key}, function (data) {

            $('#data .data').html(data.data);

        })
    }
}
