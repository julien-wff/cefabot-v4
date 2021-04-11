<!--suppress ES6UnusedImports -->
<script>
    import { onMount, setContext } from 'svelte';
    import Swal from 'sweetalert2/dist/sweetalert2';
    import { Router, Route } from 'svelte-routing';
    import Index from './pages/Index.svelte';
    import Bot from './pages/Bot.svelte';
    import NewBot from './pages/NewBot.svelte';
    import Logs from './pages/Logs.svelte';
    import Nav from './components/navbar/Nav.svelte';
    import WebAccesses from './pages/WebAccesses.svelte';
    import Settings from './pages/Settings.svelte';
    import ImportStats from './pages/ImportStats.svelte';

    export let url = '';

    const BASE_ROOT = window.WEB_ROOT ?? '';
    setContext('BASE_ROOT', BASE_ROOT);
    const APP_ROOT = `${BASE_ROOT}/app`;
    setContext('APP_ROOT', APP_ROOT);
    const API_ROOT = `${BASE_ROOT}/api`;
    setContext('API_ROOT', API_ROOT);

    onMount(async () => {
        try {
            const res = await fetch(`${API_ROOT}/session`);

            if (!res.headers.get('Content-Type')?.match('application/json'))
                throw new Error(await res.text());

            const session = await res.json();

            if (!session.permanent) {
                const remainingTime = (session.created + window.TOKEN_EXPIRE_DURATION) - Date.now();

                setTimeout(async () => {
                    await Swal.fire({
                        title: 'La session a expiré !',
                        text: 'Veuillez recréer un accès et vous reconnecter.'
                    });
                    window.location.reload();
                }, remainingTime);
            }
        } catch (e) {
            console.error(e);
            return Swal.fire({
                title: 'Impossible de récupérer la session',
                text: e instanceof Error ? e.message : e,
                icon: 'error',
            });
        }
    });
</script>


<Router {url} basepath={APP_ROOT}>
    <Nav/>
    <div>
        <Route path="/" component={Index}/>
        <Route path="bots/new" component={NewBot}/>
        <Route path="bots/:id" component={Bot}/>
        <Route path="web-access" component={WebAccesses}/>
        <Route path="logs" component={Logs}/>
        <Route path="settings" component={Settings}/>
        <Route path="import-stats" component={ImportStats}/>
    </div>
</Router>
