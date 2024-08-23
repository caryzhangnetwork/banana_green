import React, { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { profileMenuContext } from "../..//pages/Home/Home";
import { useNavigate } from 'react-router-dom';
import { updateProfileIndex } from '../../redux/menuSlice';
import { useDispatch } from 'react-redux';
import { getTasks, deleteTask } from '../../apis/taskApis'


import './ItemList.css';

export const ItemList = () => {

  
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    const asyncFn = async () => { 
      const allTask = await getTasks()
      setItemList(allTask);
    };
    asyncFn();
  }, []);

  const profileItems = useContext(profileMenuContext),
  navigate = useNavigate(),
  dispatch = useDispatch(),
  maximum = 6,

  handleNavToDetail = async (idParam) => {
    const navigateIdx = 3;
    navigate(profileItems[navigateIdx].linkUrl + '/' + idParam)
    dispatch(updateProfileIndex(navigateIdx))
  },

  handleDeleteBtnSwitcher = (e, id) => {
    e.stopPropagation();
    const updatedItemList = itemList.map(item => {
      if (item.id === id) {
        return {
          ...item,
          isDeleteSelect: !item.isDeleteSelect
        };
      }
      return item;
    });
    setItemList(updatedItemList);
  },

  handleDeleteBtn = async (e, id) => {
    e.stopPropagation();
    // need api, remove add and return a new list as response
    const newTaskList = await deleteTask(id)
    console.log("newTaskList ", newTaskList)
    setItemList(newTaskList);  
  },

  renderRemoveBtn = (item) => {
    console.log(item)
    if (!item.isDeleteSelect) {
      return <div className='itemRemoveBtn removeBtn' onMouseDown={(e) => handleDeleteBtnSwitcher(e, item.id)}> - </div>
    } else {
      return <div>
        <div className='itemRemoveBtn confirmRemoveBtn ' onMouseDown={(e) => handleDeleteBtn(e, item.id)}> 
          <FontAwesomeIcon style={{ fontSize: '12px' }} icon={faTrash} />
        </div>
        <div className='itemRemoveBtn cancelRemoveBtn' onMouseDown={(e) => handleDeleteBtnSwitcher(e, item.id)}> - </div>
      </div>
    }
  },


  renderItemList = () => {
    return itemList.map(item => {
      return <div 
        className='item' 
        key={item.id}
        onMouseDown={() => handleNavToDetail(item.id)}>
        {item.name} 
        {renderRemoveBtn(item)}
      </div>
    })
  }

  return (
    <>
      <div className={`${itemList.length < maximum ? 'btnEnable' : 'btnDisable'} item`} onMouseDown={() => handleNavToDetail('-1')} >新任务</div> 
      {
        renderItemList()
      }
    </>
  );
};

export default ItemList;
