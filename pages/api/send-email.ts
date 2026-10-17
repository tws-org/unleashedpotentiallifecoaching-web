import type { NextApiRequest, NextApiResponse } from 'next';
import sendSeverEmail from 'lib/email/server-handler';

const sendEmailHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const request = await sendSeverEmail(req.body);

    if (request?.success) {
      res.status(200).json({
        status: 200,
        message: 'Email sent!',
        data: request,
      });
      return;
    }

    res.status(502).json({
      status: 502,
      message: 'Email provider responded with an error.',
      data: request,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: 'There was an issue!',
      data: err,
    });
  }
};

export default sendEmailHandler;
