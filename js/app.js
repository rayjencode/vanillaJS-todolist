(function () {
    const itemForm = document.getElementById('itemForm');
    const itemInput = document.getElementById('itemInput');
    const feedback = document.querySelector('.feedback');
    const clearBtn = document.getElementById('clear-list');
    const itemList = document.querySelector('.item-list');

    let itemData = JSON.parse(localStorage.getItem('list')) || [];

    if (itemData.length > 0) {
        itemData.forEach(function (item) {
            itemList.insertAdjacentHTML(
                'beforeend',
                `
            <div class="item my-3">
            <h5 class="item-name text-capitalize">${item}</h5>
            <div class="item-icons">
             <a href="#" class="complete-item mx-2 item-icon"><i class="far fa-check-circle"></i></a>
             <a href="#" class="edit-item mx-2 item-icon"><i class="far fa-edit"></i></a>
             <a href="#" class="delete-item item-icon"><i class="far fa-times-circle"></i></a>
            </div>
            </div>
            `
            );

            handleItem(item);
        });
    }

    itemForm.addEventListener('submit', function (e) {
        e.preventDefault();

        let textValue = itemInput.value;

        if (textValue === '') {
            showFeedback('Please enter a valid value', 'danger');
        } else {
            addItem(textValue);
            itemInput.value = '';
            itemData.push(textValue);

            // Save to local storage
            localStorage.setItem('list', JSON.stringify(itemData));

            // Callback function to access the new Node item
            handleItem(textValue);
        }
    });

    function showFeedback(text, action) {
        feedback.classList.add('showItem', `alert-${action}`);
        feedback.innerHTML = `
            <p>${text}<p/>
        `;

        setTimeout(function () {
            feedback.classList.remove('showItem', `alert-${action}`);
        }, 3000);
    }

    function addItem(textValue) {
        const div = document.createElement('div');
        div.classList.add('item', 'my-3');
        div.innerHTML = `
        
        <h5 class="item-name text-capitalize">${textValue}</h5>
        <div class="item-icons">
         <a href="#" class="complete-item mx-2 item-icon"><i class="far fa-check-circle"></i></a>
         <a href="#" class="edit-item mx-2 item-icon"><i class="far fa-edit"></i></a>
         <a href="#" class="delete-item item-icon"><i class="far fa-times-circle"></i></a>
        </div>
        `;

        itemList.appendChild(div);
    }

    function handleItem(textValue) {
        const items = itemList.querySelectorAll('.item');
        items.forEach(function (item) {
            if (item.querySelector('.item-name').textContent === textValue) {
                // COmpleted
                item.querySelector('.complete-item').addEventListener(
                    'click',
                    function () {
                        item.querySelector('.item-name').classList.toggle(
                            'completed'
                        );
                        this.classList.toggle('visibility');
                    }
                );

                // Edit Item
                item.querySelector('.edit-item').addEventListener(
                    'click',
                    function () {
                        itemInput.value = textValue;
                        itemList.removeChild(item);

                        itemData = itemData.filter(function (item) {
                            return item !== textValue;
                        });
                        localStorage.setItem('list', JSON.stringify(itemData));
                    }
                );

                // Delete Item
                item.querySelector('.delete-item').addEventListener(
                    'click',
                    function (e) {
                        itemList.removeChild(item);

                        itemData = itemData.filter(function (item) {
                            return item !== textValue;
                        });

                        localStorage.setItem('list', JSON.stringify(itemData));

                        showFeedback(`Item ${textValue} Deleted`, 'success');
                    }
                );
            }
        });
    }

    clearBtn.addEventListener('click', function () {
        itemData = [];
        localStorage.removeItem('list');
        const items = itemList.querySelectorAll('.item');
        if (items.length > 0) {
            items.forEach(function (item) {
                itemList.removeChild(item);
            });
        }

        showFeedback('All Items has been removed', 'success');
    });
})();
