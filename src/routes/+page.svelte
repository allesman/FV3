<script>
    import { onMount } from 'svelte';
    import { PushNotifications } from '@capacitor/push-notifications';
    // import pushNotifications from '$lib/pushNotifications';

    // import { onMount } from 'svelte';
    let tableHTML = '';
    let time="";
    onMount(async () => {
        await addListeners();
        await registerNotifications();
        await getDeliveredNotifications();


        console.log('Fetching table HTML...');
        const response = await fetch('http://localhost:3000/table');
        if (!response.ok) {
            console.error('Error fetching table HTML:', response.statusText);
            return;
        }
        console.log("Hello");
        tableHTML = await response.text();
        const response2 = await fetch('http://localhost:3000/time');
        if (!response2.ok) {
            console.error('Error fetching table HTML:', response.statusText);
            return;
        }
        time = await response2.text();
        console.log('Received table:', tableHTML);
    });



const addListeners = async () => {
	await PushNotifications.addListener('registration', (token) => {
		console.info('Registration token: ', token.value);
	});

	await PushNotifications.addListener('registrationError', (err) => {
		console.error('Registration error: ', err.error);
	});

	await PushNotifications.addListener('pushNotificationReceived', (notification) => {
		console.log('Push notification received: ', notification);
	});

	await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
		console.log(
			'Push notification action performed',
			notification.actionId,
			notification.inputValue
		);
	});

};

const registerNotifications = async () => {
	let permStatus = await PushNotifications.checkPermissions();

	if (permStatus.receive === 'prompt') {
		permStatus = await PushNotifications.requestPermissions();
	}

	if (permStatus.receive !== 'granted') {
		throw new Error('User denied permissions!');
	}

	await PushNotifications.register();
};

const getDeliveredNotifications = async () => {
	const notificationList = await PushNotifications.getDeliveredNotifications();
	console.log('delivered notifications', notificationList);
};
const sendTestNotification = async () => {
    // Simulate sending a test push notification from the client (not recommended in production)
    // In a real scenario, this logic would be on the server side
    await PushNotifications.createChannel({
      id: 'test-channel',
      name: 'Test Channel',
      description: 'Channel for test notifications',
    });

    await PushNotifications.schedule({
      notifications: [
        {
          title: 'Test Notification',
          body: 'This is a test push notification.',
          id: 1,
          channelId: 'test-channel',
        },
      ],
    });

    console.log('Test push notification scheduled.');


    // es gibt sogar so average männer die haben so below average männer
};

</script>
<div>
    <div class="absolute right-0 mr-14">
        <label class="swap swap-rotate">
        <!-- this hidden checkbox controls the state -->
        <input type="checkbox" class="theme-controller" value="aqua"/>
        
        <!-- sun icon -->
        <svg class="swap-on fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
        
        <!-- moon icon -->
        <svg class="swap-off fill-secondary w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
        
        </label>
    </div>
<h1 class="text-[100px] flex justify-center mx-36 font-extrabold m-10 text-[#84ffc9] drop-shadow-[4px_4px_0px_rgba(0,60,0,2.5)] select-none">Vertretungsplan</h1>


{#if tableHTML === ''}
<div class="flex justify-center mt-20">
        <!-- <p class="text-[#84ffc9] select-none">Loading...</p> -->
        <span class="loading loading-dots loading-lg bg-[#84ffc9]"></span></div>
    {:else}
    <div class="flex justify-center mt-20">
            <table class="table-lg table table-zebra outline-dashed outline-[#84ffc9] text-white font-semibold size-32">
                {@html tableHTML}
            </table>
        </div>
        <p class="flex justify-center m-14 text-[#62b08e] ">{time}</p>
    {/if}
    <button class="btn btn-outline btn-primary" on:click={sendTestNotification}>
        Send Test Push Notification
    </button>
</div>