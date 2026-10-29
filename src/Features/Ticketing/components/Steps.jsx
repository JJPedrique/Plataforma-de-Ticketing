function Steps({Number,Text}) {
    return (     
    <div className='m-6'>
        <div className='flex gap-1 place-items-center'>
        <div className='bg-linear-to-br from-orange-500 to-orange-600 rounded-full m-1 w-10 h-10 flex items-center justify-center font-bold text-white'>
            <span>{Number}</span>
        </div>
            <h2 className='text-2xl font-semibold'>{Text}</h2>
        </div>
        
    </div> );
}

export default Steps;