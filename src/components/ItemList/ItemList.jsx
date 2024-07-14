import React, { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { profileMenuContext } from "../..//pages/Home/Home";
import { useNavigate } from 'react-router-dom';
import { updateProfileIndex } from '../../redux/menuSlice';
import { useDispatch } from 'react-redux';
import './ItemList.css';

export const ItemList = () => {
  const [itemList, setItemList] = useState([]),
  profileItems = useContext(profileMenuContext),
  navigate = useNavigate(),
  dispatch = useDispatch(),
  maximum = 6,

  handleAddItem = () => {
    const navigateIdx = 1
    navigate(profileItems[navigateIdx].linkUrl + '/true')
    dispatch(updateProfileIndex(navigateIdx))

    // need api, remove add and return a new list as response
    setItemList([ 
      ...itemList, 
      {
        key: itemList.length + 1, 
        priority: itemList.length + 1, 
        percentage: 0, 
        isDeleteSelect: false
      }
    ])
  },

  handleDeleteBtnSwitcher = (key) => {
    const updatedItemList = itemList.map(item => {
      if (item.key === key) {
        return {
          ...item,
          isDeleteSelect: !item.isDeleteSelect
        };
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
      return <div className='itemRemoveBtn removeBtn' onMouseDown={() => handleDeleteBtnSwitcher(item.key)}> - </div>
    } else {
      return <div>
        <div className='itemRemoveBtn confirmRemoveBtn ' onMouseDown={() => handleDeleteBtn(item.key)}> 
          <FontAwesomeIcon style={{ fontSize: '12px' }} icon={faTrash} />
        </div>
        <div className='itemRemoveBtn cancelRemoveBtn' onMouseDown={() => handleDeleteBtnSwitcher(item.key)}> - </div>
      </div>
    }
  },


  renderItemList = () => {
    return itemList.map(item => {
      return <div className='item' key={item.key}>
        {item.priority} -
        {`${item.percentage}%`}
        {renderRemoveBtn(item)}
      </div>
    })
  }

  return (
    <>
      <div className={`${itemList.length < maximum ? 'btnEnable' : 'btnDisable'} item`} onMouseDown={handleAddItem} >新任务</div>
      {
        renderItemList()
      }
    </>
  );
};

export default ItemList;
