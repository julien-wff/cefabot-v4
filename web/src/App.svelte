<!--suppress ES6UnusedImports -->
<script>
    import { Router, Route } from 'svelte-routing';
    import Index from './pages/Index.svelte';
    import Bot from './pages/Bot.svelte';
    import NewBot from './pages/NewBot.svelte';
    import Logs from './pages/Logs.svelte';
    import Nav from './components/navbar/Nav.svelte';
    import WebAccesses from './pages/WebAccesses.svelte';
    import Settings from './pages/Settings.svelte';

    export let url = '';
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
