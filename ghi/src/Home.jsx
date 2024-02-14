import Landing from './components/Home/Landing';
import Nav from './components/Home/Nav';
import Row from './components/Home/Rows'
import Menu from './components/Home/Menu';

function Home () {
    return(
        <div>
            <Nav />
            <Menu />
            <Landing />
            <Row path="/" element={<Row />} />


        </div>
    )
}
export default Home
