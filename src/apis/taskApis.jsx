import axios from 'axios';

const user = JSON.parse(localStorage.getItem('user'));

// get task list
export const getTasks = async () => {
  const req = {
    create_by: user.user_id
  };
  const res = await axios.post('/api/getTasks', req)
  if (res.data.status === 1) {
    return res.data.result;
  }
  return '';
}

// get task type list
export const getTaskTypes = async () => {
  const res = await axios.get('/api/getTaskTypes')
  if (res.data.status === 1) {
    return res.data.result;
  }
  return '';
}

// get task and its' subtask
export const getTaskDetail = async (taskId) => {
  const req = {
    id: taskId
  };
  const res = await axios.post('/api/getTaskDetail', req)
  if (res.data.status === 1) {
    return res.data.result;
  } 
  return '';
}

export const updateTask = async (data) => {
  const task = data.task,
   req = {
    task: {
      create_by: user.user_id,
      id: task.id ? task.id : -1,
      name: task.name ? task.name : '',
      task_type: task.task_type ? task.task_type : '',
      priority: 0,
      status: task.status ? task.status : 0,
      start_date: task.start_date ? task.start_date : '',
      end_date: task.end_date ? task.end_date : '',
      progress: task.progress ? task.progress : 0,
      data_type: task.data_type ? task.data_type : ''
    },
    task_event: data.task_event ? data.task_event.map(event => {
      return {
        name: event.subItemName, 
        status: event.isSelected ? 1 : 0,
        start_date: event.event_start_date,
        end_date: event.event_end_date,
        parent_id: event.parent_id,
        isDeleted: event.isDeleted,
        id: event.event_id ? event.event_id : -1
      }
    }) : []
  };
  const res = await axios.post('/api/updateTask', req)
  if (res.data.status === 1) {
    return res.data.result;
  }
  return '';
}


export const updateTaskEvent = async (data) => {
  const req = {
    id: data.id ? data.id : '',
    name: data.subItemName ? data.subItemName : '',
    status: data.status ? data.status : 0,
    parent_id: data.parent_id ? data.parent_id : '',
    start_date: data.event_start_date ? data.event_start_date : '',
    end_date: data.event_end_date ? data.event_end_date : '',
    temp_start_date: data.temp_start_date ? data.temp_start_date : '',
    isCancelStatus: data.isCancelStatus ? data.isCancelStatus : false,
    data_type: data.data_type ? data.data_type : ''
  };
  console.log("updateTaskEvent req ", req)
  const res = await axios.post('/api/updateTaskEvent', req)
  if (res.data.status === 1) {
    return true
  }
  return false;
}


export const deleteTask = async (id) => {
  const req = {
    id: id ? id : '',
    create_by: user.user_id
  };
  const res = await axios.post('/api/deleteTask', req)
  if (res.data.status === 1) {
    return res.data.result;
  }
  return [];
}


export default updateTask;


