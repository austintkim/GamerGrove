import board from '../../assets/board.png';

const Board = () => {
    return(
        <div>
            <h5>
                <img className='boardimg' src={board} alt='' />
            </h5>
        </div>
    )
}

export default Board;
