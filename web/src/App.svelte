<!--suppress ES6UnusedImports -->
<script>
    import { onMount } from 'svelte';
    import Swal from 'sweetalert2/dist/sweetalert2';
    import { Router, Route } from 'svelte-routing';
    import Index from './pages/Index.svelte';
    import Bot from './pages/Bot.svelte';
    import NewBot from './pages/NewBot.svelte';
    import Logs from './pages/Logs.svelte';
    import Nav from './components/navbar/Nav.svelte';
    import WebAccesses from './pages/WebAccesses.svelte';
    import Settings from './pages/Settings.svelte';

    export let url = '';

    onMount(async () => {
        try {
            const res = await fetch('/api/session');

            if (res.headers['Content-Type'] !== 'application/json')
                throw new Error(await res.text());

            const session = await res.json();
            const TOKEN_VALIDITY = 3600 * 1000;
            const remainingTime = (session.created + TOKEN_VALIDITY) - Date.now();

            setTimeout(async () => {
                await Swal.fire({
                    title: 'La session a expiré !',
                    text: 'Veuillez recréer un accès et vous reconnecter.'
                });
                window.location.reload();
            }, remainingTime);
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


<Router {url} basepath="/app">
    <Nav/>
    <div>
        <Route path="/" component={Index}/>
        <Route path="bots/new" component={NewBot}/>
        <Route path="bots/:id" component={Bot}/>
        <Route path="web-access" component={WebAccesses}/>
        <Route path="logs" component={Logs}/>
        <Route path="settings" component={Settings}/>
    </div>
</Router>
