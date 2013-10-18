rv = {

    tree: null,
    storage: null,

    init: function () {
        rv.storage = $.localStorage;
        rv.tree = $('#tree')


        rv.tree.bind('tree.init', function () {

        });
        rv.tree.bind('tree.click', rv.nodeClick);
        rv.tree.bind('tree.select', rv.nodeSelect);
        rv.tree.bind('tree.open', rv.changeState);
        rv.tree.bind('tree.close', rv.changeState);

        var ms = new Date().getTime();
        rv.tree.tree({
            data: '/r.php?m=tree&ms=' + ms,
            selectable: true,
            slide: false,
            useContextMenu: false
        });


        rv.treeRefresh();
    },

    treeRefresh: function () {
        var ms = new Date().getTime();
        rv.tree.tree('loadDataFromUrl', '/r.php?m=tree&ms=' + ms, null, rv.setState);
    },

    getState: function () {
        var state = rv.tree.tree('getState');
        rv.storage.set('state', state);
    },

    setState: function () {
        var state = rv.storage.get('state')
        rv.tree.tree('setState', state);

        var node = rv.tree.tree('getSelectedNode');
        if (node) {
            rv.tree.tree('selectNode', node);
            rv.load(node.fullpath);
        }
    },

    load: function (key) {
        $('#data h1').text(key);
        $('#data .data').html('');
        var ms = new Date().getTime();
        $.post('/r.php?m=load&ms=' + ms, {key: key}, function (data) {
            $('#data .data').html(data.data);
        })
    },

    nodeClick: function (event) {
        var node = event.node;
        if (node.children.length > 0)
            rv.tree.tree('toggle', node);
        rv.getState();

    },

    nodeSelect: function (e) {
        if (e.node)
            if (e.node.children.length == 0) {
                rv.load(e.node.fullpath);
                rv.changeState();
            }
    },

    changeState: function () {
        rv.getState();
    }
}
