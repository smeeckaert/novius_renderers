require(['jquery-nos-wysiwyg'], function ($) {

    //Add one item
    $(document).on('click', 'button.add-item-js', function(e) {
        var $button = $(this);
        var $container = $button.closest('form');
        var next = parseInt($container.find('.count-items-js').data('nb-items')) + 1;
        var model = $button.data('model');
        var relation = $button.data('relation');
        var order = $button.data('order');

        $.ajax({
            type : "GET",
            url: 'admin/novius_renderers/hasmany/add_item/' + next,
            data : {
                model : model,
                relation : relation,
                order: order
            },
            success : function(vue) {
                var $vue = $(vue);
                $vue.nosFormUI();
                $container.find('.item_list').append($vue);
                $container.find('.count-items-js').data('nb-items', next);
            }
        });
        e.preventDefault();
    });

    //Duplicate an item
    $(document).on('click', 'button.dupli-item-js', function(e){
        var $div = $(this).closest('.hasmany_item');
        var index = $div.data('item-index');
        var next = $div.closest('.count-items-js').find('.hasmany_item').length + 1;
        var $button = $div.closest('.count-items-js').find('button.add-item-js');
        var model = $button.data('model');
        var relation = $button.data('relation');
        var order = $button.data('order');
        var data = {};
        data.forge = {};

        //select all inputs (cannot search on name, assuming it begins with "relation", because it's possible that it doesn't
        $div.find('input, select').each(function() {
            var $input = $(this);
            var input_name = $input.attr('name');
            if (typeof input_name != "undefined" && input_name.length > 0) {
                var value = $input.val();
                var begin = input_name.lastIndexOf('[') + 1;
                if (begin > 0) {
                    var end = input_name.lastIndexOf(']');
                    var name = input_name.substring(begin, end);
                    data.forge[name] = value;
                }
            }
        });
        data.model = model;
        data.relation = relation;
        data.order = order;

        $nos.ajax({
            type : "GET",
            url: 'admin/novius_renderers/hasmany/add_item/' + next,
            data : data,
            success : function(vue) {
                var $vue = $(vue);
                $vue.nosFormUI();
                $div.closest('.item_list').append($vue);
                $div.closest('.count-items-js').data('nb-items', next);
            }
        });
        e.preventDefault();
    });

    //Delete an item
    $(document).on('click', '.hasmany_delete_item', function() {
        var question = $(this).data('question');
        var removed = $(this).data('removed');
        if (confirm(question))
        {
            if(removed.length > 0) {
                $(this).closest('.hasmany_item').html('<table><tr><th></th><td class="hasmany_message">' + removed + '</td></tr></table>');
            } else {
                $(this).closest('.hasmany_item').remove();
            }

        }
    });

    // TODO Move an item
    // arrows only exist if the "order" option is activated
    $(document).on('click', '.hasmany_icon_arrow', function() {
        var down = $(this).hasClass('item-down-js');
        var $item = $(this).closest('.hasmany_item');
        var former_value = parseInt($item.find('input[name$="order]"]').val());
        var $swapper = down ? $item.next() : $item.prev();
        var $textarea = $item.find('textarea.tinymce');
        //Deal with a possible wysiwyg
        if ($textarea.length > 0) {
            var id_tiny = $textarea.attr('id');
            tinyMCE.get(id_tiny).save();
            tinyMCE.get(id_tiny).remove();
        }

        $swapper.find('input[name$="order]"]').val(former_value);
        if (down) {
            $item.find('input[name$="order]"]').val(former_value + 1);
            $swapper.after($item);
        } else {
            $item.find('input[name$="order]"]').val(former_value - 1);
            $swapper.before($item);
        }

        if ($textarea.length > 0) {
            $textarea.wysiwyg($textarea.data('wysiwyg-options'));
        }
    });
});