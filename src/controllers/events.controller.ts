import { Response } from 'express';
import { IPaginationQuery, IReqUser } from '../utils/interfaces';
import response from '../utils/response';
import EventModel, { EventDAO, TypeEvent } from '../models/events.model';
import { FilterQuery, isValidObjectId } from 'mongoose';
import uploader from '../utils/uploader';

export default {
  async createEvent(req: IReqUser, res: Response) {
    try {
      const payload = {
        ...req.body,
        createdBy: req.organizer?.id,
      } as TypeEvent;
      await EventDAO.validate(payload);
      const result = await EventModel.create(payload);
      response.success(res, result, 'Success create event');
    } catch (error) {
      response.error(res, error, 'Failed');
    }
  },
  async getAllEvents(req: IReqUser, res: Response) {
    try {
      const buildQuery = (filter: any) => {
        let query: FilterQuery<TypeEvent> = {};
        if (filter.search) query.$text = { $search: filter.search };
        if (filter.category) query.category = filter.category;
        if (filter.isOnline) query.isOnline = filter.isOnline;
        if (filter.isPublish) query.isPublish = filter.isPublish;
        return query;
      };

      const {
        limit = 10,
        page = 1,
        search,
        category,
        isOnline,
        isPublish,
      } = req.query;

      const query = buildQuery({
        search,
        category,
        isOnline,
        isPublish,
      });

      const result = await EventModel.find(query)
        .populate('createdBy', 'organizerName email logo')
        .populate('currentVolunteers', 'fullName email phone profilePicture')
        .populate('category', 'name')
        .limit(+limit)
        .skip((+page - 1) * +limit)
        .sort({ createdAt: -1 })
        .lean()
        .exec();
      const count = await EventModel.countDocuments(query);
      response.pagination(
        res,
        result,
        {
          current: +page,
          total: count,
          totalPages: Math.ceil(count / +limit),
        },
        'Success get all events'
      );
    } catch (error) {
      response.error(res, error, 'Failed get all events');
    }
  },
  async getEventById(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id))
        return response.notFound(res, 'Id event not found');

      const result = await EventModel.findById(id)
        .populate('createdBy', 'organizerName email logo')
        .populate('currentVolunteers', 'fullName email phone profilePicture')
        .populate('category', 'name')
        .lean();
      if (!result) return response.notFound(res, 'Event not found');

      response.success(res, result, 'Success get event by id');
    } catch (error) {
      response.error(res, error, 'Failed get event by id');
    }
  },
  async getEventByOrganizerId(req: IReqUser, res: Response) {
    try {
      const { organizerId } = req.params;
      if (!isValidObjectId(organizerId))
        return response.notFound(res, 'Organizer not found');

      const result = await EventModel.find({ createdBy: organizerId })
        .populate('createdBy', 'organizerName email logo')
        .populate('currentVolunteers', 'fullName email phone profilePicture')
        .populate('category', 'name');
      if (!result) return response.notFound(res, 'Event not found');
      response.success(res, result, 'Success get event by organizer');
    } catch (error) {
      response.error(res, error, 'Failed get event by organizer');
    }
  },
  async updateEvent(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id))
        return response.notFound(res, 'Event not found');

      const event = await EventModel.findById(id);
      if (!event) return response.notFound(res, 'Event not found');
      const payload: TypeEvent = {
        ...req.body,
        location: {
          region: req.body.location?.region || event?.location?.region,
          address: req.body.location?.address || event?.location?.address,
        },
      };
      if (payload.name) {
        const slug = payload.name.split(' ').join('-').toLowerCase();
        payload.slug = slug;
      }

      const result = await EventModel.findByIdAndUpdate(id, payload, {
        new: true,
      });
      response.success(res, result, 'Success update event');
    } catch (error) {
      response.error(res, error, 'Failed update event');
    }
  },
  async deleteEvent(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id))
        return response.notFound(res, 'Event not found');

      const result = await EventModel.findByIdAndDelete(id, {
        new: true,
      });
      if (!result) return response.notFound(res, 'Event not found');
      await uploader.remove(result?.image);
      response.success(res, result, 'Success delete event');
    } catch (error) {
      response.error(res, error, 'Failed delete event');
    }
  },
  async getEventBySlug(req: IReqUser, res: Response) {
    try {
      const { slug } = req.params;
      const result = await EventModel.findOne({ slug })
        .populate('createdBy', 'organizerName email logo')
        .populate('currentVolunteers', 'fullName email phone profilePicture')
        .populate('category', 'name');
      if (!result) return response.notFound(res, 'Event not found');
      response.success(res, result, 'Success get event by slug');
    } catch (error) {
      response.error(res, error, 'Failed get event by slug');
    }
  },
  async getMyEventOrganizer(req: IReqUser, res: Response) {
    const {
      limit = 10,
      page = 1,
      search,
    } = req.query as unknown as IPaginationQuery;
    const query = {};

    try {
      const organizerId = req.organizer?.id;
      if (!organizerId) return response.notFound(res, 'Organizer not found');
      if (search) {
        Object.assign(query, {
          ...query,
          $text: { $search: search },
        });
      }
      const result = await EventModel.find({ createdBy: organizerId, ...query })
        .populate('createdBy', 'organizerName email logo')
        .populate('currentVolunteers', 'fullName email phone profilePicture')
        .populate('category', 'name')
        .limit(+limit)
        .skip((+page - 1) * +limit)
        .sort({ createdAt: -1 })
        .exec();
      const count = await EventModel.countDocuments({
        createdBy: organizerId,
        ...query,
      });
      response.pagination(
        res,
        result,
        {
          current: +page,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
        'Success get event by organizer'
      );
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
};
