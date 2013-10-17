rv = {

    tree: null,
    storage: null,

    init: function () {
        rv.storage = $.localStorage;
        rv.tree = $('#tree')
        rv.tree.tree({
            data: '/r.php?m=tree',
            selectable: false,
            slide: false,
            useContextMenu: false
        });

        rv.treeRefresh();

        $('#tree').bind('tree.click', rv.nodeClick);
    },

    treeRefresh: function () {
        rv.tree.tree('loadDataFromUrl', '/r.php?m=tree');
        var state = rv.storage.get('state');
        console.log(state);
        //rv.tree.tree('setState', state);

        if (state && state.open_nodes && state.open_nodes.length > 0) {

            $.each(state.open_nodes, function (index, id) {
                var node = rv.tree.tree('getNodeById', id);
                if (node) {
                    rv.tree.tree('openNode', node);
                    console.log('node founded ' + id);
                    console.log(typeof node);
                    rv.tree.tree('openNode', id);
                } else {
                    console.log('node not founded ' + id);
                }
            });
        }
    },

    load: function (key) {

        $('#data h1').text(key);
        var ms = new Date().getTime();
        $.post('/r.php?m=load&ms=' + ms, {key: key}, function (data) {
            console.log(data);
            $('#data .data').html(data.data);
        })
    },

    nodeClick: function (event) {

        var state = rv.tree.tree('getState');
        rv.storage.set('state', state);
        console.log(state);

        var node = event.node;
        if (node.children.length > 0) {


            rv.tree.tree('toggle', node);
        } else if (node.fullpath) {
            rv.load(node.fullpath)
        }

    }
}
