import React, { useState, useEffect, useContext } from 'react';
import { profileMenuContext } from "../..//pages/Home/Home";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCirclePlus, faPenToSquare, faCheck } from '@fortawesome/free-solid-svg-icons';
import { updateProfileIndex } from '../../redux/menuSlice';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import './ItemDetail.css';

export const ItemDetail = () => {

  const profileItems = useContext(profileMenuContext),
  [itemList, setItemList] = useState([]),
  [isEdit, setIsEdit] = useState(false),
  param = useParams();

  useEffect(() => {
    setIsEdit(param.isEdit === 'true');
  }, []);

  const dispatch = useDispatch(),
  navigate = useNavigate(),
  title = '',
  typeName = '',
  typeColor = '',

  handleAddItem = () => {
    // need api, remove add and return a new list as response
    setItemList([ 
      ...itemList, 
      {
        key: itemList.length + 1, 
        priority: itemList.length + 1, 
        percentage: 0, 
        isSelected: false,
        isDeleteSelect: false,    //delete section container open controller
        isSelectBoxShake: false,  //selecter container shaking controller
        isStatusBoxShake: false, //statux container shaking controller
        itemStatusStart: true, //status start as true, status end as false
        startTime: '',
        endTime: ''
      }
    ])
  },

  handleEditComplete = () => {
    const navigateIdx = 0
    navigate(profileItems[navigateIdx].linkUrl)
    dispatch(updateProfileIndex(navigateIdx))
  },

  updateItemProperty = (key, fieldNames, values) => {
    const updatedItemList = itemList.map(item => {
      if (item.key === key) {
        fieldNames.forEach((fieldName, index) => {
          item[fieldName] = values[index];
        });
      }
      return item;
    });
    setItemList(updatedItemList);
  },

  handleDeleteBtn = (key) => {
    // need api, remove add and return a new list as response
    const updatedItemList = itemList.filter(item => item.key !== key);
    setItemList(updatedItemList);  
  },

  renderRemoveBtn = (item) => {
    if (!item.isDeleteSelect) {
      return <div className='itemRemoveBtn removeBtn' onMouseDown={() => updateItemProperty(item.key, ['isDeleteSelect'], [true])}> - </div>
    } else {
      return <div>
        <div className='itemRemoveBtn confirmRemoveBtn ' onMouseDown={() => handleDeleteBtn(item.key)}> 
          <FontAwesomeIcon style={{ fontSize: '12px' }} icon={faTrash} />
        </div>
        <div className='itemRemoveBtn cancelRemoveBtn' onMouseDown={() => updateItemProperty(item.key, ['isDeleteSelect'], [false])}> - </div>
      </div>
    }
  },

  handleSelectItem = (key) => {
    const currentItem = itemList.find(item => item.key === key);
    if (currentItem && currentItem.itemStatusStart) {
      const isSelectedValue = !currentItem.isSelected;
      updateItemProperty(key, ['isSelected'], [isSelectedValue])
      // need api, to update task status on database
    } else {
      // to prevent and alert user if this item is not end, dont select the task
      if (currentItem && !currentItem.isSelected && !currentItem.itemStatusStart) {
      updateItemProperty(key, ['isStatusBoxShake'], [true])
        setTimeout(() => {
          updateItemProperty(key, ['isStatusBoxShake'], [false])
        }, 500);
      } 
    }

  },

  handleItemStatus = (key, status) => {
    const currentItem = itemList.find(item => item.key === key);
    if (currentItem && !currentItem.isSelected) {
      if(currentItem.itemStatusStart) {
        updateItemProperty(key, ['itemStatusStart', 'startTime'], [status, new Date()])
      } else {
        updateItemProperty(key, ['itemStatusStart', 'startTime'], [status, ''])
        //the start time and end time need to update to database instead of store in local
        // need api, to update startTime and endTime to database
      }
    } else {
      // to prevent and alert user if this item is select, dont start the task
      if (currentItem && currentItem.isSelected && currentItem.itemStatusStart) {
        updateItemProperty(key, ['isSelectBoxShake'], [true])
        setTimeout(() => {
          updateItemProperty(key, ['isSelectBoxShake'], [false])
        }, 500);
      } 
    }
  },
  handleStatusSwitcher = (item) => {
    if (item.itemStatusStart) {
      return <div className='statusBtn statusStart' onMouseDown={() => handleItemStatus(item.key, false)}>开始</div>
    } else {
      return <div>
        <div className={`statusBtn statusCancel ${item.isStatusBoxShake ? 'shakeAnimation' : ''}`}
          onMouseDown={() => updateItemProperty(item.key, ['itemStatusStart', 'startTime'], [true, ''])}>
          返回
        </div>
        <div className={`statusBtn statusEnd ${item.isStatusBoxShake ? 'shakeAnimation' : ''}`} onMouseDown={() => handleItemStatus(item.key, true)}>结束</div>
      </div>
    }
  },

  renderItemList = () => {
    return itemList.map(item => {
      // for Edit page
      if (isEdit) {
        return <div className='editItem' key={item.key}>
          {item.priority} -
          {`${item.percentage}%`}
          {renderRemoveBtn(item)}
        </div>
      } else {
        // for general page type

        return <div className="generalItemContainer" key={item.key}>
          <div  className={`itemCheckBox ${item.isSelectBoxShake ? 'shakeAnimation' : ''}`} onMouseDown={() => handleSelectItem(item.key)}>
            {item.isSelected ? <div className='selectRatio'></div> : null}
          </div>
          <div className='generalItem'>
            {item.priority} -
            {`${item.percentage}%`}
            {handleStatusSwitcher(item)}
          </div>
        </div>

      }
    })
  }

  return (

    <>
      <div className='pageHeader'>
        <div className='headerBlock pageTypeTag' style={{backgroundColor: typeColor}}>{typeName}</div>
        <div className='headerBlock pageTitle'>{title}</div>
        <div className='headerBlock pageActionTag'>
          <FontAwesomeIcon className={isEdit ? 'editBtn' : 'completeBtn' } 
            icon={isEdit ? faCheck : faPenToSquare } 
            onMouseDown={handleEditComplete}
          />
        </div>
      </div>
        <FontAwesomeIcon className='addItemBtn' onMouseDown={handleAddItem} icon={faCirclePlus} />
      {
        renderItemList()
      }
    </>
  );
};

export default ItemDetail;

