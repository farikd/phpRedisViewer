rv = {

    tree: null,
    storage: null,
    state: null,

    init: function () {
        rv.storage = $.localStorage;
        rv.tree = $('#tree')


        rv.tree.bind('tree.init', function () {
            console.log('tree init');
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
        console.log(state);
    },

    setState: function () {
        rv.tree.tree('setState', rv.storage.get('state'));
        
    },

    load: function (key) {

        $('#data h1').text(key);
        var ms = new Date().getTime();
        $.post('/r.php?m=load&ms=' + ms, {key: key}, function (data) {
            $('#data .data').html(data.data);
        })
    },

    nodeClick: function (event) {
        var node = event.node;
        rv.tree.tree('selectNode', node);
        if (node.children.length > 0) {
            rv.tree.tree('toggle', node);
        }
        return false;


        if (node.children.length > 0) {
            rv.tree.tree('toggle', node);
        } else if (node.fullpath) {
            rv.tree.tree('selectNode', node);
            rv.load(node.fullpath);
        }
        rv.getState();
    },

    nodeSelect: function (e) {
        console.log('select');
        if (e.node) {
            console.log('node selected');
            if (e.node.children.length == 0) {
                console.log('no children');
                rv.load(e.node.fullpath);
                rv.changeState();
            }
        }

    },

    changeState: function () {
        rv.getState();
    }
}
