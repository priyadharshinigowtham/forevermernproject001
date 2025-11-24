// import React, { useContext } from 'react'
// import { ShopContext } from '../context/ShopContext'
// import { Link } from 'react-router-dom'

// const ProductItem = ({ id, image, name, price }) => {
//   const { currency } = useContext(ShopContext)

//   // Extract number from ID (example: "aaaab" becomes 2)
//   const num = parseInt(id.replace(/\D/g, ""))

//   // Generate image path automatically based on file naming
//   let imgFile = `/src/assets/p_img${num}.png`

//   // For products that have multiple image versions (ex: p_img2_1.png)
//   if (num >= 2) {
//     imgFile = `/src/assets/p_img${num}_1.png`
//   }

//   return (
//     <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
//       <div className='overflow-hidden'>
//         <img 
//           className='hover:scale-110 transition ease-in-out'
//           src={imgFile}
//           alt={name}
//         />
//       </div>
//       <p className='pt-3 pb-1 text-sm'>{name}</p>
//       <p className='text-sm font-medium'>{currency}{price}</p>
//     </Link>
//   )
// }

// export default ProductItem






























import React, { useContext } from 'react'
import { ShopContext } from '../context/shopContext'
import { Link } from 'react-router-dom'

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext)

  return (
    <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
      <div className='overflow-hidden'>
        <img className='hover:scale-110 transition ease-in-out 'src={image[0]} alt="" />
      </div>
      <p className='pt-3 pb-1 text-sm'>{name}</p>
      <p className='text-sm font-medium'>{currency}{price}</p>
    </Link>
  )
}

export default ProductItem;

