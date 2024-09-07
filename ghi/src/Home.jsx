import {useState, useEffect} from 'react';
import Landing from './components/Home/Landing';
import Nav from './components/Home/Nav';
import Row from './components/Home/Rows'
import Menu from './components/Home/Menu';

function Home () {
    const [userToken, setUserToken] = useState(null);
    const [userDataDetails0, setUserDataDetails0] = useState('');

    const fetchUserData = async () => {
        const tokenUrl = `${import.meta.env.VITE_API_HOST}/token`;

        const fetchConfig = {
        credentials: 'include',
        };

        const response = await fetch(tokenUrl, fetchConfig);
        const data = await response.json();
        if (data) {
            setUserToken(data.access_token);
            setUserDataDetails0(data.account);
            return data.account;
        } else {
            throw new Error ('No active token')
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return(
        <div>
            <Nav
            userCookie = {userToken}
            userData0 = {userDataDetails0}
            />
            <Menu />
            <Landing />
            <Row path="/" element={<Row />} />


        </div>
    )
}
export default Home
