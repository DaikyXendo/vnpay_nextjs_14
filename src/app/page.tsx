'use client'
import queryString from 'query-string'
import dateFormat from 'dateformat'
import sha256 from 'sha256'
import { useState } from 'react'
import * as ip from 'ip'
import { Box, Button, TextareaAutosize } from '@mui/material'

const HASH_SECRET = 'INVLFPJEZDJVOVNYSJAIOYQBXOAUNQHP'
const TMNCODE = '3N2TIUAX'
const VNP_URL = 'http://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
const VNP_RETURN = 'http://localhost:3000'

export default function Home() {
    const [url, setUrl] = useState('')

    const handlePayment = async () => {
        const tmnCode = TMNCODE
        console.log(tmnCode)
        const secretKey = HASH_SECRET
        const returnUrl = VNP_RETURN

        const date = new Date()

        const createDate = dateFormat(date, 'yyyymmddHHmmss')
        const orderId = dateFormat(date, 'HHmmss')
        const amount = '2155000'
        const bankCode = 'NCB'

        const orderInfo = 'Nap tien cho thue bao 0123456789. So tien 100,000'
        const orderType = 'topup'
        const locale = 'vn'
        const currCode = 'VND'
        const set_vnp_Params: any = {}

        set_vnp_Params['vnp_Version'] = '2'
        set_vnp_Params['vnp_Command'] = 'pay'
        set_vnp_Params['vnp_TmnCode'] = tmnCode
        set_vnp_Params['vnp_Locale'] = locale
        set_vnp_Params['vnp_CurrCode'] = currCode
        set_vnp_Params['vnp_TxnRef'] = orderId
        set_vnp_Params['vnp_OrderInfo'] = orderInfo
        set_vnp_Params['vnp_OrderType'] = orderType
        set_vnp_Params['vnp_Amount'] = Number(amount) * 100
        set_vnp_Params['vnp_ReturnUrl'] = returnUrl
        set_vnp_Params['vnp_IpAddr'] = ip.address()
        set_vnp_Params['vnp_CreateDate'] = createDate
        set_vnp_Params['vnp_BankCode'] = bankCode

        const vnp_Params = sortObject(set_vnp_Params)

        const signData =
            secretKey + queryString.stringify(vnp_Params, { encode: false })

        // var sha256 = require('sha256');

        const secureHash = sha256(signData)

        vnp_Params['vnp_SecureHashType'] = 'SHA256'
        vnp_Params['vnp_SecureHash'] = secureHash
        const vnpUrl =
            VNP_URL + '?' + queryString.stringify(vnp_Params, { encode: true })
        setUrl(vnpUrl)
    }

    return (
        <Box
            sx={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                m: 20,
            }}
        >
            <Button variant='contained' onClick={handlePayment}>
                Thanh toan
            </Button>
            <TextareaAutosize value={url} readOnly />
            <a href={url}>
                <Button variant='contained'>Go</Button>
            </a>
        </Box>
    )
}

function sortObject(o: any) {
    const sorted: any = {}
    const onlyKey: any = []

    for (const key in o) {
        if (o.hasOwnProperty(key)) {
            onlyKey.push(key)
        }
    }

    onlyKey.sort()

    Array.from({ length: onlyKey.length }, (_, idx) => {
        sorted[onlyKey[idx]] = o[onlyKey[idx]]
        return null
    })

    return sorted
}
