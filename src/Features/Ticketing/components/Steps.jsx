function Steps({Number,Text}) {
    return (     
    <div className='m-6'>
        <div className='flex gap-1 place-items-center'>
        <div className='bg-amber-500 rounded-full m-1 w-10 h-10 flex items-center justify-center font-bold text-white'>
            <span>{Number}</span>
        </div>
            <h2 className='text-2xl font-black'>{Text}</h2>
        </div>
        <hr className='mt-1 mx-1 text-amber-400 border' />
    </div> );
}

export default Steps;