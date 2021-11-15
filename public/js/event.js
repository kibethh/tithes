import { showAlert } from './alerts';
export const createEvent = async (data) => {
  const url = '/api/v1/events';
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.fromEntries(data)),
    });
    if (resp.status === 201) {
      const jsonResp = await resp.json();
      console.log(jsonResp.status);
      showAlert('success', 'Event Added');
      window.setTimeout(() => {
        history.go();
      }, 1500);
      return;
    }
    const jsonResp = await resp.json();
    showAlert('error', jsonResp.message);
  } catch (err) {
    showAlert('error', "Can't add Event,try later!!");
  }
};
export const updateEvent = async (data, id) => {
  const url = '/api/v1/events/' + id;
  try {
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.fromEntries(data)),
    });
    if (resp.status === 200) {
      const jsonResp = await resp.json();
      console.log(jsonResp.status);
      showAlert('success', 'Event Updated');
      window.setTimeout(() => {
        history.go();
      }, 1500);
      return;
    }
    const jsonResp = await resp.json();
    showAlert('error', jsonResp.message);
  } catch (err) {
    showAlert('error', "Can't update Event,try later!!");
  }
};
export const deleteEvent = async (id) => {
  const url = '/api/v1/events/' + id;
  try {
    const resp = await fetch(url, {
      method: 'DELETE',
    });

    if (resp.status === 200) {
      const jsonResp = await resp.json();
      console.log(jsonResp.status);
      showAlert('success', 'Event Deleted');
      window.setTimeout(() => {
        history.go();
      }, 1500);
      return;
    }
    const jsonResp = await resp.json();
    console.log(jsonResp);
    showAlert('error', jsonResp.message);
  } catch (err) {
    showAlert('error', "Can't Delete event,try later!!");
  }
};
