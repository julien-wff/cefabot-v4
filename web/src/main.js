import App from './App.svelte';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import relativeTimePlugin from 'dayjs/plugin/relativeTime';

dayjs.locale('fr');
dayjs.extend(relativeTimePlugin);

const app = new App({
    target: document.body,
});

export default app;
