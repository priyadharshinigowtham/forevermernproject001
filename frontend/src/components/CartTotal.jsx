import React, { useContext } from 'react'
import { ShopContext } from '../context/shopContext'
import Title from '../components/Title'

const CartTotal = () => {

    const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

    return (
        <div className="w-full flex justify-end mt-10">
            
            {/* Container width matches screenshot */}
            <div className="w-full sm:w-[55%] md:w-[40%] lg:w-[30%]">

                <div className="text-2xl mb-4">
                    <Title text1={"CART"} text2={"TOTALS"} />
                </div>

                <div className="flex flex-col gap-3 text-sm">

                    {/* Subtotal */}
                    <div className="flex justify-between">
                        <p>Subtotal</p>
                        <p>{currency}{getCartAmount()}.00</p>
                    </div>

                    <hr />

                    {/* Shipping Fee */}
                    <div className="flex justify-between">
                        <p>Shipping Fee</p>
                        <p>{currency}{delivery_fee}.00</p>
                    </div>

                    <hr />

                    {/* Total */}
                    <div className="flex justify-between font-semibold">
                        <p>Total</p>
                        <p>{currency}{getCartAmount() + delivery_fee}.00</p>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default CartTotal