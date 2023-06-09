const express = require("express");
const Booking = require("../models/Booking");
const Room = require("../models/room");
const router = express.Router();
const moment = require('moment')
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')('sk_test_51LnLoXDrzZ3jiAgjSKJJjbmEeuZGQ5By19Z9SQ4bxNOrZYoGhKCbCimo73ZeOS3k28oNztS1wj4Ounv18Q1yZCbG00yF1014Fr')

router.post("/bookroom", async (req, res) => {
    const { room,
        userid,
        fromdate_1,
        todate_1,
        totalamount,
        totaldays, token } =  req.body

    try {

        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        })

        const payment = await stripe.charges.create(

            {
                amount: totalamount,
                customer: customer.id,
                currency: 'JPY',
                receipt_email: token.email

            }, {
            idempotencyKey: uuidv4()
        }
        )

        if (payment) {

            try {
                const newbooking = new Booking({
                    room: room.name,
                    roomid: room._id,
                    userid,
                    fromdate: moment(fromdate_1).format('DD-MM-YYYY'),
                    todate: moment(todate_1).format('DD-MM-YYYY'),
                    totalamount,
                    totaldays,
                    transactionId: '1234'
                })

                const booking = await newbooking.save()

                const roomtemp = await Room.findOne({ _id: room._id })

                roomtemp.currentbookings.push({
                    bookingid: booking._id, fromdate: moment(fromdate_1).format('DD-MM-YYYY'),
                    todate: moment(todate_1).format('DD-MM-YYYY'),
                    userid: userid, status: booking.status
                })

                await roomtemp.save()

                

            } catch (error) {
                return res.status(400).json({ error })
            }
        }

        res.send('Payment Successfull, Your Room is Booked')

    } catch (error) {
        return res.status(400).json({ error })
    }

})

router.post("/getbookingsbyuserid", async (req, res) => {

    const {userid} = req.body

    try {
        const bookings = await Booking.find({userid : userid})
        res.send(bookings)

    } catch (error) {
        return res.status(400).json({error})
    }
})

router.post("/cancelBooking" , async (req , res) => {

    const {bookingid , roomid} = req.body

    try {
        const bookingitem = await Booking.findOne({_id : bookingid})

        bookingitem.status = 'cancelled'
        await bookingitem.save()
        const room = await Room.findOne({_id : roomid})

        const bookings = room.currentbookings

        const temp = bookings.filter(booking => booking.bookingid.toString() !== bookingid)
        room.currentbookings = temp

        await room.save()

        res.send("Your Booking Cancelled Successfully")

    } catch (error) {
        return res.status(400).json({error})
    }
})

module.exports = router