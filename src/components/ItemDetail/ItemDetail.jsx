import React, { useState, useEffect, useContext } from 'react';
import { profileMenuContext } from "../../pages/Home/Home";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCirclePlus, faPenToSquare, faCheck } from '@fortawesome/free-solid-svg-icons';
import { updateProfileIndex } from '../../redux/menuSlice';
import { useDispatch } from 'react-redux';
import { updateTask, getTaskDetail, updateTaskEvent, getTaskTypes } from '../../apis/taskApis'
import { useParams, useNavigate } from 'react-router-dom';
import { taskEventStatusEnum, taskStatusEnum } from '../../enums/task';
import './ItemDetail.css';

export const ItemDetail = () => {
  const profileItems = useContext(profileMenuContext),
  [itemList, setItemList] = useState([]),
  [isParentEdit, setIsParentEdit] = useState(false),
  [isSelfEdit, setIsSelfEdit] = useState(false),
  [pageItem, setPageItem] = useState({}),
  [taskTypes, setTaskTypes] = useState([]),
  [isTypePopoverOpen, setIsTypePopoverOpen] = useState(false),

  param = useParams();

  useEffect(() => {
    setIsParentEdit(param.id === '-1');
    if (param.id >= '0') {
      const asyncFn = async () => { 
        const result = await getTaskDetail(param.id);
        setUpPageData(result)
      };
      asyncFn();
    } else {
      setPageItem({
        task_id: -1,
        task_name: '',
        task_type_id: '',
        priority: 0,
        task_status: 0,
        start_date: '',
        end_date: '',
        progress: 0,
      })
    }
    window.addEventListener('beforeunload', () => {
      setIsSelfEdit(false);
      setIsParentEdit(false);
    });
  }, []);

  const dispatch = useDispatch(),
  navigate = useNavigate(),

  handleSetItemList = (itemlist) => {
    const newItemList = itemlist.map(item => Object.assign(item, {
        event_id: item.event_id,
        key: item.event_id, 
        subItemName: item.event_name,
        parent_id: item.task_id,
        isSelected: item.event_status === taskEventStatusEnum.Completed ? true : false, 
        event_start_date: item.event_start_date,
        event_end_date: item.event_end_date,
        event_duration: item.event_duration,
        event_status: item.event_status,

        isUpdated: false,
        isDeleted: false,

        isDeleteSelect: false,   
        isSelectBoxShake: false,  
        isStatusBoxShake: false,  
      }
    ))
    console.log("handleSetItemList item ", itemlist)
    setItemList(newItemList)
  },

  setUpPageData = (result) => {
    const task_events = result.task_event,
    task = result.task;
    console.log("task ", task)
    setPageItem(task);
    if(task_events.length > 0) {
      handleSetItemList(task_events);
    }
  },

  handleAddItem = async () => {
    // need api, remove add and return a new list as response
    setItemList([ 
      ...itemList, 
      {
        key: Math.random().toString(36),
        subItemName: '',
        parent_id: pageItem['task_id'],
        isSelected: false,
        event_start_date: '',
        event_end_date: '',
        event_status: 0,
        event_duration: '',

        isUpdated: true,           // to help filtering request data, only send updated data to api
        isDeleted: false,          // soft delete data on fontend

        isDeleteSelect: false,    //delete section container open controller
        isSelectBoxShake: false,  //selecter container shaking controller
        isStatusBoxShake: false,  //statux container shaking controller
      }
    ])
  },

  itemValidation = () => {
    const itemListInvalited = itemList.length === 0 || itemList.some(item => item.subItemName === '');
    if (pageItem.task_name === '' || 
       pageItem.task_type_id === '' || 
      itemListInvalited) {
      return false;
    } 
    return true;
  },

  handleEditComplete = async () => {
    if (!isParentEdit && !isSelfEdit) {
      //open edit task event
      setIsSelfEdit(true);
    } else if (isSelfEdit) {
      //complete edit task event
      if (itemValidation()) {
        setIsSelfEdit(false);
        const result = await updateTask({
          task: {
            id: pageItem['task_id'],
            name: pageItem['task_name'],
            task_type: pageItem['task_type_id'],
            priority: pageItem['priority'],
            status: pageItem['task_status'],
            start_date: pageItem['start_date'],
            end_date: pageItem['end_date'],
            progress: pageItem['progress'],
            data_type: 'update'
          },
          task_event: itemList.filter(item => item.isUpdated)
        })
        console.log("handleEditComplete ", result)
        setUpPageData(result)
      }
    } else {
      //creating task 
      if (itemValidation()) {
        const result = await updateTask({
          task: {
            name: pageItem['task_name'],
            task_type: pageItem['task_type_id'],
            priority: 0,
            status: taskStatusEnum.Pending,
            start_date: '',
            end_date: '',
            progress: 0,
            data_type: 'new'
          },
          task_event: itemList.filter(item => item.isUpdated)
        })
        console.log("handleEditComplete ", result)
        setUpPageData(result)
        setIsParentEdit(false);
        const navigateIdx = 0;
        navigate(profileItems[navigateIdx].linkUrl);
        dispatch(updateProfileIndex(navigateIdx));
      }
    }
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
    const targetItem = itemList.find(item => item.key === key);
    if (targetItem && !targetItem.event_id) {
      const updatedItemList = itemList.filter(item => item.key !== key)
      setItemList(updatedItemList);  
    } else {
      updateItemProperty(key, ['isUpdated', 'isDeleted'], [true, true])
    }
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

  updateItemName = (e) => {
    setPageItem({
      ...pageItem, 
      task_name: e.target.value 
    });
  },

  renderTypeList = () => {
    return taskTypes.map(type => {
      return <div 
        style={{backgroundColor: type['task_type_color']}}
        className='typeItem' 
        key={type.task_type_id}
        onMouseDown={() => handleTypeSelection(type)}>
        {type.task_type_name} 
      </div>
    })
  },

  handleTypeSelection = (type) => {
    setPageItem({
      ...pageItem, 
      task_type_id: type.task_type_id,
      task_type_color: type.task_type_color,
      task_type_name: type.task_type_name
    })
    setIsTypePopoverOpen(false);
  },

  handleSubjectChange = async () => {
    if (!isTypePopoverOpen) {
      const taskTypes = await getTaskTypes();
      setIsTypePopoverOpen(true);
      setTaskTypes(taskTypes);
    } else {
      setIsTypePopoverOpen(false);
      setTaskTypes([]);
    }
  },


  handleSelectItem = async (key) => {
    const currentItem = itemList.find(item => item.key === key);
    // when event is with "开始" status
    if (currentItem && currentItem.event_status !== taskEventStatusEnum.Working) {
      const today = new Date(),
      new_event_status = currentItem.event_status === taskEventStatusEnum.Completed  ? taskEventStatusEnum.Pending  : taskEventStatusEnum.Completed ,
      new_end_date = currentItem.event_status === taskEventStatusEnum.Completed ? today : '',
      updateSeccuess = await updateTaskEvent({
        id: currentItem.event_id,
        subItemName: currentItem.subItemName,
        status: new_event_status,
        parent_id: currentItem.parent_id,
        event_start_date: currentItem.event_start_date,
        event_end_date: new_end_date,
        temp_start_date: '',
        data_type: 'update'
      })
      if (updateSeccuess) {
        const isSelectedValue = new_event_status === taskEventStatusEnum.Completed ? true : false;
        updateItemProperty(key, ['isSelected', 'end_date', 'event_status'], [isSelectedValue, new_end_date, new_event_status])
      }
    } else {
      // to prevent and alert user if this item is not end, dont select the task
      if (currentItem && !currentItem.isSelected && currentItem.event_status !== taskEventStatusEnum.Pending) {
        updateItemProperty(key, ['isStatusBoxShake'], [true])
        setTimeout(() => {
          updateItemProperty(key, ['isStatusBoxShake'], [false])
        }, 500);
      } 
    }
  },

  handleItemStatus = async (key, status, isCancelStatus) => {
    const currentItem = itemList.find(item => item.key === key),
    today = new Date();
    // when event is not completed
    if (currentItem && !currentItem.isSelected) {
      // when event is with "开始" status
      if(currentItem.event_status === taskEventStatusEnum.Pending) {
        console.log("currentItem Id if ", currentItem)
        const updateSeccuess = await updateTaskEvent({
          id: currentItem.event_id,
          subItemName: currentItem.subItemName,
          status: taskEventStatusEnum.Working,
          parent_id: currentItem.parent_id,
          event_start_date: currentItem.event_start_date === '' ? today : currentItem.event_start_date,
          event_end_date: currentItem.end_date,
          temp_start_date: today,
          data_type: 'update'
        })
        console.log("updateSeccuess ", updateSeccuess)
        if (updateSeccuess) {
          updateItemProperty(key, ['event_status', 'event_start_date', 'isUpdated'], [status, today, false])
        }
      } else {
        // when event is with "结束" or "取消" status
        console.log("currentItem Id else ", currentItem)
        // when event_start_date is '', it means the first time this event start 
        const updateSeccuess = await updateTaskEvent({
          id: currentItem.event_id,
          subItemName: currentItem.subItemName,
          status: taskEventStatusEnum.Pending,
          parent_id: currentItem.parent_id,
          event_start_date: currentItem.event_start_date,
          event_end_date: currentItem.event_end_date,
          temp_start_date: '',
          isCancelStatus: isCancelStatus,
          data_type: 'update'
        })
        if (updateSeccuess) {
          updateItemProperty(key, ['event_status', 'event_start_date', 'isUpdated'], [status, '', false])
        }
        //the start time and end time need to update to database instead of store in local
      }
    } else {
      // to prevent and alert user if this item is select, dont start the task
      if (currentItem && currentItem.isSelected && currentItem.event_status === taskEventStatusEnum.Working) {
        updateItemProperty(key, ['isSelectBoxShake'], [true])
        setTimeout(() => {
          updateItemProperty(key, ['isSelectBoxShake'], [false])
        }, 500);
      } 
    }
  },

  handleStatusSwitcher = (item) => {
    if (item.event_status === taskEventStatusEnum.Pending) {
      return <div className='statusBtn statusStart' onMouseDown={() => handleItemStatus(item.key, taskEventStatusEnum.Working, false)}>
        开始
      </div>
    } else {
      return <div>
        <div className={`statusBtn statusCancel ${item.isStatusBoxShake ? 'shakeAnimation' : ''}`}
          onMouseDown={() => handleItemStatus(item.key, taskEventStatusEnum.Pending, true)}>
          返回
        </div>
        <div className={`statusBtn statusEnd ${item.isStatusBoxShake ? 'shakeAnimation' : ''}`} 
        onMouseDown={() => handleItemStatus(item.key, taskEventStatusEnum.Pending, false)}>
          结束
        </div>
      </div>
    }
  },

  renderItemList = () => {
    return itemList.filter(item => !item.isDeleted).map(item => {
      // for Edit page
      if (isSelfEdit || isParentEdit) {
        return <div className={`editItem ${item.isSelected ? 'selectedItem' : ''}`} key={item.key}>
            <input className={`subItemName ${item.subItemName === '' ? 'flashAnimation subItemNameBtn' : ''}`} 
              value={item.subItemName} 
              placeholder = '请输入任务名字'
              onChange={e => updateItemProperty(item.key, ['subItemName', 'isUpdated'], [e.target.value, true])}
            />
          {!item.isSelected ? renderRemoveBtn(item) : null}
        </div>
      } else {
        // for general page type
        return <div className="generalItemContainer" key={item.key}>
          <div  className={`itemCheckBox ${item.isSelectBoxShake ? 'shakeAnimation' : ''}`} onMouseDown={() => handleSelectItem(item.key)}>
            {item.isSelected ? <div className='selectRatio'></div> : null}
          </div>
          <div className={`generalItem ${item.isSelected ? 'selectedItem' : ''}`}>
            <div className='generalItemSubItemName'>{item.subItemName} </div>
            {(!item.isSelected ? handleStatusSwitcher(item) : null)}
          </div>
        </div>

      }
    })
  }

  return (
    <>
      {(isSelfEdit || isParentEdit) ? 
        <div className='pageHeader'>
          <div className='headerBlock pageTypeTag' 
            style={{backgroundColor: pageItem['task_type_color']}}
            onMouseDown={handleSubjectChange}
            >
              {pageItem["task_type_name"]}
              <span className={`triangle ${isTypePopoverOpen ? 'up' : 'down'}`}></span>
          </div>
          { 
          isTypePopoverOpen ?  
            <div className="typePopover">
              {
                renderTypeList()
              }
            </div> : null
          }

          <div className='headerBlock pageTitle'>
            <input className='editTitle' value={pageItem["task_name"]} onChange={updateItemName}  style={{textAlign: 'center'}}/>
            <span className={`warningMsg ${pageItem["task_name"] === '' ? '' : 'displayNone'}`}>请输入任务名字</span> 
          </div> 
          <div className='headerBlock pageActionTag'>
            <FontAwesomeIcon className={`editBtn ${    
              pageItem.task_name === '' || 
              pageItem.task_type_id === '' || 
              itemList.length === 0 || 
              itemList.some(item => item.subItemName === '')
                  ? 'disabledBtn' : 'enabledBtn'}`}
              icon={ faCheck } 
              onMouseDown={handleEditComplete}
            />
          </div>
        </div> :
        <div className='pageHeader'>
          <div className='headerBlock pageTypeTag' style={{backgroundColor: pageItem['task_type_color']}}>{pageItem["task_type_name"]}</div>
          <div className='headerBlock pageTitle'>{pageItem["task_name"]}</div> 
          <div className='headerBlock pageActionTag'>
            <FontAwesomeIcon className='completeBtn'
              icon={ faPenToSquare } 
              onMouseDown={handleEditComplete}
            />
          </div>
        </div>
      }
      {
        renderItemList()
      }
      {(isSelfEdit || isParentEdit) ? <FontAwesomeIcon className='addItemBtn' onMouseDown={handleAddItem} icon={faCirclePlus} /> : null}
    </>
  );
};

export default ItemDetail;

