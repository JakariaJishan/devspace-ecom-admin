const Card = ({record, title, list, color}) => {
  return (
    <div className={`border border-gray-200 p-6 rounded-lg`} style={{backgroundColor: color || '#FFF'}}
    >
      <h2 className="text-5xl">{record}</h2>
      <p className="text-gray-700 text-xs uppercase mt-2 font-semibold ">{title}</p>

      <div className="mt-6">
        {
          list && list.length > 0 && list.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <p className="text-gray-400">{item.category_name}</p>
              <p>{item.total_earning}</p>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Card;