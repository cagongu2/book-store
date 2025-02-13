import { Outlet } from 'react-router-dom';
import './App.css';

function App() {
    return (
        <>
            <nav>Navbar</nav>
            <main className='min-h-screen max-w-creen mx-auto px-4 py-6 font-primary underline'>
                <Outlet />
            </main>
            <footer>Footer</footer>
        </>
    );
}

export default App;