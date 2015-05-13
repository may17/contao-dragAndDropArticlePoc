/**
 *
 *          _           _                       _
 *         | |         | |                     | |
 *      ___| | __ _ ___| |____      _____  _ __| | _____
 *     / __| |/ _` / __| '_ \ \ /\ / / _ \| '__| |/ / __|
 *     \__ \ | (_| \__ \ | | \ V  V / (_) | |  |   <\__ \
 *     |___/_|\__,_|___/_| |_|\_/\_/ \___/|_|  |_|\_\___/
 *                                        web development
 *
 *     http://www.slash-works.de </> hallo@slash-works.de
 *
 *
 * @author      jrgregory
 * @copyright   jrgregory@slashworks
 * @since       13.05.15 | KW 20 01:07
 * @package     Core
 *
 */

Contao = Contao || {};

Contao.DragAndDropArticle = (function() {

    /**
     * Include drag icons
     */

    function setIcons() {
        $$('.tl_listing .tl_file').each(function(el) {

            if(!el.getElement('.tl_left img.movethis')) {
                var moveItem = new Element('img', {'src': 'system/modules/dragAndDrop/assets/img/arrow-move.png','alt': 'move', 'class': 'movethis'});
                moveItem.inject(el.getElement('.tl_left a') ,'before');
            }

        });
    }

    function dragAndDropHandler(event) {

        event.stop();

        // buffer the original item
        var originalDragItem = this;

        /**
         * check if item has drag item
         */

        if(event.target.hasClass('movethis')) {

            /**
             * clone current element for move effect
             * @type {*}
             */

            var cloneDragItem = originalDragItem.getElement('.tl_left')
                    .clone()
                    .setStyles(this.getCoordinates())
                    .setStyles({
                        opacity: 0.7,
                        position: 'absolute'
                    })
                    .inject(document.body);


            /**
             * create drag and drop instance
             * @type {Drag.Move}
             */

            var drag = new Drag.Move(cloneDragItem, {

                droppables: $$('.tl_listing .tl_file, .tl_listing .tl_folder'),

                onDrop: function(draggedItem, destinationItem){

                    // private buffer variable for padding
                    var _padding,
                        _tlLeft = destinationItem.getElement('.tl_left');

                    // remove the cloned element
                    draggedItem.destroy();

                    // remove outline
                    destinationItem.setStyle('outline', 'none');
                    
                    // inject original item
                    originalDragItem.inject(destinationItem,'after');

                    // set the padding for the element
                    originalDragItem.getElement('.tl_left').setStyles({
                        'paddingLeft': (destinationItem.hasClass('tl_folder')) ? _tlLeft.getStyle('paddingLeft').toInt() + 40 : _tlLeft.getStyle('paddingLeft').toInt()
                    });

                },
                onEnter: function(draggedItem, destinationItem){
                    destinationItem.setStyle('outline', '2px dotted #8AB858');
                },
                onLeave: function(draggedItem, destinationItem){
                    destinationItem.setStyle('outline', 'none');
                },
                onCancel: function(draggedItem){
                    draggedItem.destroy();
                }
            });

            // init drag and drop
            drag.start(event);
        }

    }

    return {

        init: function() {
            setIcons();
            $$('.tl_listing .tl_file').addEvent('mousedown', dragAndDropHandler);
        }

    }

})();

window.addEvent('domready', function() {

    Contao.DragAndDropArticle.init();

});

window.addEvent('ajax_change', function() {
    Contao.DragAndDropArticle.init();
})

