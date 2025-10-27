import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { Option } from "@/types/option.type";
import { City } from "@/types/city.type";
import { Community } from "@/types/community.type";
import { Subcommunity } from "@/types/subcommunity.type";
import { Property } from "@/types/property.type";
import { Listing } from "@/types/listing.type";

import { Contact } from "@/types/contact.type";
import { PhotoRequest } from "@/types/photo-request.type";
import { Photoshoot } from "@/types/photoshoot.type";
import { ExtensionRequest } from "@/types/extension-request.type";
import { UnpublishRequest } from "@/types/unpublish-request.type";
import { User } from "@/types/user.type";
import { CreateUnpublishRequestDto } from "@/components/RequestUnpublishListingDialog";

import { CreateContactDto } from "@/components/CreateContactDialog/Form";

import { ReAssignDto } from "@/components/Re-assignDialog";

import { Lead } from "@/types/lead.type";
import { Viewing } from "@/types/viewing.type";

import { Offer } from "@/types/offer.type";

import { Qualification } from "@/types/qualification.type";

import { LeadContact } from "@/types/lead-contact.type";
import { Feedback } from "@/types/feedback.type";
import { Campaign } from "@/types/campaign.type";
import { Team } from "@/types/team.type";
import { Document } from "@/types/document.type";
import { Deal } from "@/types/deal.type";

type Common = {
  countryCodes: Option[];
  nationalities: Option[];
  contactTypes: Option[];
  fitted: Option[];
  sources: Option[];
  roles: { id: string; name: string }[];
  categories: Option[];
  bedrooms: Option[];
  amenities: { id: string; name: string }[];
  leadContactType: Option[];
  features: { id: string; name: string }[];
  locations: Option[];
  furnished: Option[];
  propertyStatus: Option[];
  leaseTerm: Option[];
  cheques: Option[];
  bathrooms: Option[];
  appliances: Option[];
};

type CreateListingRequest = {
  isRental: boolean;
  isSale: boolean;
  isRented: boolean;

  cityId: string | null;
  communityId: string | null;
  subcommunityId: string | null;
  propertyId: string | null;

  sourceId: string | null;

  title: string;
  categoryId: string | null;
  description: string | null;
  unitNumber: string | null;
  totalArea: number | null;

  plotArea: number | null;

  numberOfBedrooms: number | null;
  numberOfBathrooms: number | null;
  floor: number | null;
  view: string | null;
  str: string | null;
  furnished: string | null;
  features: string[];
  amenities: string[];
  appliances: boolean;
  parking: number | null;

  streetNumber: string | null;
  serviceCharge: number | null;

  contactId: string | null;
  fitted: string | null;

  askForPrice: boolean;
  isExclusive: boolean;
  isCommercial: boolean;

  pricePerSqft: number | null; // is this for both sale and rental?

  propertyStatus: string | null;
  salePrice: number | null;

  rentedFrom: string | null;
  rentedUntil: string | null;
  rentedPrice: number | null;

  rentedCheques: number | null;
  tenant: string | null;

  rentalPrice: number | null;

  rentalCheques: number | null;
  rentalLeaseTerm: string | null;
  rentalAvailableFrom: string | null;

  isHalfBath: boolean; // ????
  isPrimary: boolean; // ????

  brokerContractRentalDocument: Document | null;
  brokerContractSaleDocument: Document | null;
  titleDeedDocument: Document | null;
  poaDocument: Document | null;
  ownerIdDocument: Document | null;
  otherDocument: Document | null;
};

const paramsSerializer = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();

  for (const key in params) {
    const value = params[key];

    if (Array.isArray(value)) {
      value.forEach((item) => {
        searchParams.append(`${key}[]`, item);
      });
      continue;
    }

    if (value) {
      searchParams.append(key, value);
    }
  }

  return searchParams.toString();
};

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    paramsSerializer,
    credentials: "include",
  }),
  tagTypes: [
    "Common",
    "Listing",
    "Contact",
    "PhotoRequest",
    "ExtensionRequest",
    "UnpublishRequest",
    "Photoshoot",
    "User",
    "Photographer",
    "PhotoEditor",
    "Profile",
    "Lead",
    "LeadExtensionRequest",
    "Campaign",
    "Team",
    "Viewing",
    "Offer",
    "LeadContact",
    "Deal",
  ],
  endpoints: (builder) => ({
    getCities: builder.query<Option[], void>({
      query: () => ({ url: "cities" }),
      transformResponse: (data: City[]) =>
        data.map((c) => ({ label: c.name, value: c.id })),
    }),
    getCommunities: builder.query<Option[], string>({
      query: (cityId: string) => ({ url: `communities`, params: { cityId } }),
      transformResponse: (data: Community[]) =>
        data.map((c) => ({ label: c.name, value: c.id })),
    }),
    getSubcommunities: builder.query<Option[], string>({
      query: (communityId: string) => ({
        url: `subcommunities`,
        params: { communityId },
      }),
      transformResponse: (data: Subcommunity[]) =>
        data.map((c) => ({ label: c.name, value: c.id })),
    }),
    getProperties: builder.query<Option[], string>({
      query: (subcommunityId: string) => ({
        url: `properties`,
        params: { subcommunityId },
      }),
      transformResponse: (data: Property[]) =>
        data.map((c) => ({ label: c.name, value: c.id })),
    }),
    createListing: builder.mutation<Listing, CreateListingRequest>({
      invalidatesTags: ["Listing"],
      query: (body) => ({
        url: "listings",
        method: "POST",
        body,
      }),
    }),
    getContacts: builder.query<Option[], void>({
      providesTags: ["Contact"],
      query: () => ({
        url: `contacts`,
      }),
      transformResponse: (
        data: { name: string; email: string; id: string }[]
      ) => data.map((c) => ({ label: `${c.name} (${c.email})`, value: c.id })),
    }),
    createContact: builder.mutation<Contact, CreateContactDto>({
      invalidatesTags: ["Contact"],
      query: (body) => ({
        url: "contacts",
        method: "POST",
        body,
      }),
    }),
    getCommon: builder.query<Common, void>({
      providesTags: ["Common"],
      query: () => ({
        url: "common",
      }),
    }),
    getListings: builder.query<
      { total: number; data: Listing[] },
      {
        page?: string;
        pageSize?: string;
        status?: string[];
        isExclusive?: string;
        isSale?: boolean;
        isRental?: boolean;
        include?: string;
        search?: string;
      }
    >({
      providesTags: ["Listing"],
      query: (params) => ({
        url: `listings`,
        params,
      }),
    }),
    updateListing: builder.mutation<
      Listing,
      CreateListingRequest & { id: string }
    >({
      invalidatesTags: ["Listing"],
      query: ({ id, ...body }) => ({
        url: `listings/${id}`,
        method: "PUT",
        body,
      }),
    }),
    getListing: builder.query<Listing, { listingId: string; include?: string }>(
      {
        providesTags: ["Listing"],
        query: ({ listingId, ...params }) => ({
          url: `listings/${listingId}`,
          params,
        }),
      }
    ),
    deleteListing: builder.mutation<void, string>({
      invalidatesTags: ["Listing"],
      query: (listingId) => ({
        url: `listings/${listingId}`,
        method: "DELETE",
      }),
    }),
    getPhotoRequest: builder.query<
      PhotoRequest,
      { id: string; include?: string }
    >({
      providesTags: ["PhotoRequest"],
      query: ({ id, ...params }) => ({
        url: `photo-requests/${id}`,
        params,
      }),
    }),
    createPhotoRequest: builder.mutation<
      PhotoRequest,
      {
        listingId: string;
        scheduledAt: string;
        occupancy: string;
        keyLocation: string;
        buildingAccessCardLocation: string;
        parkingAccessCardLocation: string;
        comments: string;
        isBrokerPresent: boolean;
      }
    >({
      invalidatesTags: ["PhotoRequest", "Listing"],
      query: (body) => ({
        url: "photo-requests",
        method: "POST",
        body,
      }),
    }),
    cancelPhotoRequest: builder.mutation<unknown, string>({
      invalidatesTags: ["PhotoRequest", "Listing"],
      query: (id) => ({
        url: `photo-requests/${id}/cancel`,
        method: "POST",
      }),
    }),
    approvePhotoRequest: builder.mutation<PhotoRequest, string>({
      invalidatesTags: ["PhotoRequest"],
      query: (photoRequestId) => ({
        url: `photo-requests/${photoRequestId}/approve`,
        method: "POST",
      }),
    }),
    rejectPhotoRequest: builder.mutation<
      PhotoRequest,
      { id: string; rejectionReason: string }
    >({
      invalidatesTags: ["PhotoRequest"],
      query: ({ id, ...body }) => ({
        url: `photo-requests/${id}/reject`,
        method: "POST",
        body,
      }),
    }),
    getPhotoRequests: builder.query<
      { total: number; data: PhotoRequest[] },
      {
        page?: string;
        pageSize?: string;
        isSale?: string;
        isRental?: string;
        status?: string[];
        include?: string;
        search?: string;
      }
    >({
      providesTags: ["PhotoRequest"],
      query: (params) => ({
        url: "photo-requests",
        params,
      }),
    }),
    getUsers: builder.query<
      { total: number; data: User[] },
      {
        page?: string;
        pageSize?: string;
        search?: string;
        include?: string;
        flat?: boolean;
      }
    >({
      providesTags: ["User"],
      query: (params) => ({
        url: "users",
        params,
      }),
    }),
    createUser: builder.mutation<
      User,
      {
        name: string;
        email: string;
        phoneNumberCountryCode: string;
        phoneNumber: string;
        role: string;
        confirmPassword: string;
        password: string;
      }
    >({
      invalidatesTags: ["User"],
      query: (body) => ({
        url: "users",
        method: "POST",
        body,
      }),
    }),
    getPhotoshoots: builder.query<
      { total: number; data: Photoshoot[] },
      { page?: string; pageSize?: string; include?: string; status?: string[] }
    >({
      providesTags: ["Photoshoot"],
      query: (params) => ({
        url: "photoshoots",
        params,
      }),
    }),
    getPhotographers: builder.query<Option[], void>({
      providesTags: ["Photographer"],
      query: () => ({
        url: "photographers",
      }),
      transformResponse: (data: { id: string; name: string }[]) =>
        data.map((c) => ({ label: c.name, value: c.id })),
    }),
    getPhotoEditors: builder.query<Option[], void>({
      providesTags: ["PhotoEditor"],
      query: () => ({
        url: "photo-editors",
      }),
      transformResponse: (data: { id: string; name: string }[]) =>
        data.map((c) => ({ label: c.name, value: c.id })),
    }),
    assignPhotoshoot: builder.mutation<
      unknown,
      { id: string; photographerId: string; editorId: string }
    >({
      invalidatesTags: ["Photoshoot", "PhotoRequest"],
      query: ({ id, ...body }) => ({
        url: `photoshoots/${id}/assign`,
        method: "POST",
        body,
      }),
    }),
    submitPhotoshoot: builder.mutation<unknown, string>({
      invalidatesTags: ["Photoshoot"],
      query: (id) => ({
        url: `photoshoots/${id}/submit`,
        method: "POST",
      }),
    }),
    approvePhotoshoot: builder.mutation<unknown, string>({
      invalidatesTags: ["Photoshoot", "Listing"],
      query: (photoshootId) => ({
        url: `photoshoots/${photoshootId}/approve`,
        method: "POST",
      }),
    }),
    publishListing: builder.mutation<
      unknown,
      { id: string; trakheesi: string }
    >({
      invalidatesTags: ["Listing"],
      query: ({ id, ...body }) => ({
        url: `listings/${id}/publish`,
        method: "POST",
        body,
      }),
    }),
    getExtensionRequests: builder.query<
      { total: number; data: ExtensionRequest[] },
      {
        page?: string;
        pageSize?: string;
        status?: string[];
        isRental?: string;
        isSale?: string;
        include?: string;
        search?: string;
      }
    >({
      providesTags: ["ExtensionRequest"],
      query: (params) => ({
        url: "extension-requests",
        params,
      }),
    }),
    createExtensionRequest: builder.mutation<
      ExtensionRequest,
      { listingId: string; comments: string }
    >({
      invalidatesTags: ["ExtensionRequest"],
      query: (body) => ({
        url: "extension-requests",
        method: "POST",
        body,
      }),
    }),
    getExtensionRequest: builder.query<
      ExtensionRequest,
      { extensionRequestId: string; include?: string }
    >({
      providesTags: ["ExtensionRequest"],
      query: ({ extensionRequestId, ...params }) => ({
        url: `extension-requests/${extensionRequestId}`,
        params,
      }),
    }),
    approveExtensionRequest: builder.mutation<unknown, string>({
      invalidatesTags: ["ExtensionRequest"],
      query: (id) => ({
        url: `extension-requests/${id}/approve`,
        method: "POST",
      }),
    }),
    createUnpublishRequest: builder.mutation<
      UnpublishRequest,
      CreateUnpublishRequestDto & { listingId: string }
    >({
      invalidatesTags: ["UnpublishRequest", "Listing"],
      query: (body) => ({
        url: "unpublish-requests",
        method: "POST",
        body,
      }),
    }),
    getUnpublishRequests: builder.query<
      { total: number; data: UnpublishRequest[] },
      {
        page?: string;
        pageSize?: string;
        isSale?: string;
        isRental?: string;
        include?: string;
        status?: string[];
        search?: string;
      }
    >({
      providesTags: ["UnpublishRequest"],
      query: (params) => ({
        url: "unpublish-requests",
        params,
      }),
    }),
    cancelUnpublishRequest: builder.mutation<unknown, string>({
      invalidatesTags: ["UnpublishRequest", "Listing"],
      query: (id) => ({
        url: `unpublish-requests/${id}/cancel`,
        method: "POST",
      }),
    }),
    rejectExtensionRequest: builder.mutation<
      unknown,
      { id: string; rejectionReason: string }
    >({
      invalidatesTags: ["ExtensionRequest", "Listing"],
      query: ({ id, ...body }) => ({
        url: `extension-requests/${id}/reject`,
        method: "POST",
        body,
      }),
    }),
    getUnpublishRequest: builder.query<
      UnpublishRequest,
      { id: string; include?: string }
    >({
      providesTags: ["UnpublishRequest"],
      query: ({ id, ...params }) => ({
        url: `unpublish-requests/${id}`,
        params,
      }),
    }),
    approveUnpublishRequest: builder.mutation<unknown, string>({
      invalidatesTags: ["UnpublishRequest", "Listing"],
      query: (id) => ({
        url: `unpublish-requests/${id}/approve`,
        method: "POST",
      }),
    }),
    rejectUnpublishRequest: builder.mutation<
      unknown,
      { id: string; rejectionReason: string }
    >({
      invalidatesTags: ["UnpublishRequest", "Listing"],
      query: ({ id, ...body }) => ({
        url: `unpublish-requests/${id}/reject`,
        method: "POST",
        body,
      }),
    }),
    archiveListing: builder.mutation<unknown, string>({
      invalidatesTags: ["Listing"],
      query: (id) => ({
        url: `listings/${id}/archive`,
        method: "POST",
      }),
    }),
    getProfile: builder.query<User, void>({
      providesTags: ["Profile"],
      query: () => ({
        url: "profile",
      }),
    }),
    signIn: builder.mutation<
      { token: string },
      { email: string; password: string }
    >({
      query: (body) => ({
        url: "auth/sign-in",
        method: "POST",
        body,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
    }),
    uploadPhotoshootImages: builder.mutation<
      string[],
      { id: string; files: File[]; identifiers: string[] }
    >({
      query: ({ id, files, identifiers }) => {
        const body = new FormData();

        files.forEach((file) => {
          body.append("files", file);
        });

        body.append("identifiers", JSON.stringify(identifiers));

        return {
          url: `photoshoots/${id}/upload`,
          method: "POST",
          body,
        };
      },
    }),
    uploadListingDocument: builder.mutation<Document, File>({
      query: (file) => {
        const body = new FormData();

        body.append("file", file);

        return {
          url: "documents/upload",
          method: "POST",
          body,
        };
      },
    }),
    republishListing: builder.mutation<Listing, string>({
      invalidatesTags: ["Listing"],
      query: (id) => ({
        url: `listings/${id}/republish`,
        method: "POST",
      }),
    }),
    deleteUser: builder.mutation<void, string>({
      invalidatesTags: ["User"],
      query: (id) => ({
        url: `users/${id}`,
        method: "DELETE",
      }),
    }),
    reAssignPhotoshoot: builder.mutation<
      Photoshoot,
      ReAssignDto & { id: string }
    >({
      invalidatesTags: ["Photoshoot", "PhotoRequest"],
      query: ({ id, ...body }) => ({
        url: `photoshoots/${id}/re-assign`,
        method: "POST",
        body,
      }),
    }),
    deleteImage: builder.mutation<
      any,
      { photoshootId: string; imageId: string }
    >({
      invalidatesTags: ["Photoshoot"],
      query: ({ photoshootId, imageId }) => ({
        url: `photoshoots/${photoshootId}/images/${imageId}`,
        method: "DELETE",
      }),
    }),
    updateProfilePassword: builder.mutation<
      any,
      { currentPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: `profile/password`,
        method: "PATCH",
        responseHandler: "text",
        body,
      }),
    }),
    updateUser: builder.mutation<
      any,
      {
        id?: string;
        name?: string;
        phoneNumber?: string | null;
        phoneNumberCountryCode?: string | null;
        role?: string;
        password?: string;
      }
    >({
      invalidatesTags: ["User", "Profile"],
      query: ({ id, ...body }) => ({
        url: `users/${id}`,
        method: "PATCH",
        body,
      }),
    }),
    updateProfile: builder.mutation<any, { name: string; phoneNumber: string }>(
      {
        invalidatesTags: ["User", "Profile"],
        query: (body) => ({
          url: "profile",
          method: "PUT",
          body,
        }),
      }
    ),
    getLead: builder.query<Lead, { leadId: string; include?: string }>({
      providesTags: ["Lead"],
      query: ({ leadId, ...params }) => ({
        url: `leads/${leadId}`,
        params,
      }),
    }),
    updateProfileImage: builder.mutation<any, File>({
      invalidatesTags: ["Profile"],
      query: (file) => {
        const body = new FormData();
        body.append("file", file);

        return {
          url: "profile/image",
          method: "PATCH",
          body,
        };
      },
    }),
    cancelViewing: builder.mutation<unknown, string>({
      invalidatesTags: ["Viewing", "Lead"],
      query: (id) => ({
        url: `viewings/${id}/cancel`,
        method: "POST",
      }),
    }),
    getLeads: builder.query<
      { total: number; data: Lead[] },
      {
        page?: string;
        pageSize?: string;
        status?: string[];
        search?: string;
        include?: string;
      }
    >({
      providesTags: ["Lead"],
      query: (params) => ({
        url: `leads`,
        params,
      }),
    }),
    getLeadsPool: builder.query<
      { total: number; data: Lead[] },
      {
        page?: string;
        pageSize?: string;
        status?: string[];
        search?: string;
        include?: string;
      }
    >({
      providesTags: ["Lead"],
      query: (params) => ({
        url: `leads/pool`,
        params,
      }),
    }),
    getViewings: builder.query<
      { total: number; data: Viewing[] },
      {
        page?: string;
        pageSize?: string;
        status?: string[];
        search?: string;
        include?: string;
      }
    >({
      providesTags: ["Viewing"],
      query: (params) => ({
        url: `viewings`,
        params,
      }),
    }),

    getOffers: builder.query<
      { total: number; data: Offer[] },
      {
        page?: string;
        pageSize?: string;
        status?: string[];
        search?: string;
        include?: string;
      }
    >({
      providesTags: ["Offer"],
      query: (params) => ({
        url: `offers`,
        params,
      }),
    }),
    getLeadContacts: builder.query<
      { total: number; data: LeadContact[] },
      {
        page?: string;
        pageSize?: string;
        status?: string[];
        search?: string;
        include?: string;
      }
    >({
      providesTags: ["LeadContact"],
      query: (params) => ({
        url: `lead-contacts`,
        params,
      }),
    }),
    approveLead: builder.mutation<Lead, string>({
      invalidatesTags: ["Lead"],
      query: (id) => ({
        url: `leads/${id}/approve`,
        method: "POST",
      }),
    }),
    rejectLead: builder.mutation<Lead, { id: string; rejectionReason: string }>(
      {
        invalidatesTags: ["Lead"],
        query: ({ id, ...body }) => ({
          url: `leads/${id}/reject`,
          method: "POST",
          body,
        }),
      }
    ),
    createLeadExtensionRequest: builder.mutation<
      unknown,
      { leadId: string; reason: string }
    >({
      invalidatesTags: ["LeadExtensionRequest"],
      query: (body) => ({
        url: `leads/extension-requests`,
        method: "POST",
        body,
      }),
    }),
    approveLeadExtensionRequest: builder.mutation<unknown, string>({
      invalidatesTags: ["LeadExtensionRequest"],
      query: (id) => ({
        url: `leads/extension-requests/${id}/approve`,
        method: "POST",
      }),
    }),
    rejectLeadExtensionRequest: builder.mutation<unknown, string>({
      invalidatesTags: ["LeadExtensionRequest"],
      query: (id) => ({
        url: `leads/extension-requests/${id}/reject`,
        method: "POST",
      }),
    }),
    getLeadExtensionRequests: builder.query<
      { total: number; data: any[] },
      {
        page?: string;
        pageSize?: string;
        search?: string;
        include?: string;
        status?: string[];
      }
    >({
      providesTags: ["LeadExtensionRequest"],
      query: (params) => ({
        url: `leads/extension-requests`,
        params,
      }),
    }),
    createViewing: builder.mutation<
      Viewing,
      {
        leadId: string;
        scheduledAt: string;
        listingId?: string;
        listing?: {
          type: string;
          numberOfBedrooms: string;
          numberOfBathrooms: string;
          furnished: string;
          price: string;
          categoryId: string;
          cityId: string;
          communityId: string;
          subcommunityId: string;
          propertyId: string;
          view: string;
          parking: string;
          plotArea: string;
          totalArea: string;
        };
      }
    >({
      invalidatesTags: ["Lead"],
      query: ({ leadId, ...body }) => ({
        url: `leads/${leadId}/viewings`,
        method: "POST",
        body,
      }),
    }),
    createOffer: builder.mutation<
      Offer,
      {
        viewingId: string;
        price: number;
        cheques?: number | null;
        offeredAt: string;
        leadId: string;
      }
    >({
      invalidatesTags: ["Lead"],
      query: ({ leadId, ...body }) => ({
        url: `leads/${leadId}/offers`,
        method: "POST",
        body,
      }),
    }),
    acceptOffer: builder.mutation<Offer, { leadId: string; offerId: string }>({
      invalidatesTags: ["Lead"],
      query: ({ leadId, offerId }) => ({
        url: `leads/${leadId}/offers/${offerId}/accept`,
        method: "POST",
      }),
    }),
    rejectOffer: builder.mutation<Offer, { leadId: string; offerId: string }>({
      invalidatesTags: ["Lead"],
      query: ({ leadId, offerId }) => ({
        url: `leads/${leadId}/offers/${offerId}/reject`,
        method: "POST",
      }),
    }),
    negotiateOffer: builder.mutation<
      Offer,
      { leadId: string; offerId: string }
    >({
      invalidatesTags: ["Lead"],
      query: ({ leadId, offerId }) => ({
        url: `leads/${leadId}/offers/${offerId}/negotiate`,
        method: "POST",
      }),
    }),
    convertOffer: builder.mutation<
      Offer,
      { leadId: string; offerId: string; unpublish: boolean }
    >({
      invalidatesTags: ["Lead"],
      query: ({ leadId, offerId, ...body }) => ({
        url: `leads/${leadId}/offers/${offerId}/convert`,
        method: "POST",
        body,
      }),
    }),
    updateQualification: builder.mutation<
      Qualification,
      {
        leadId: string;
        budget: number;
        customerType: string;
        nationalityId: string;
        levelOfInterest: number;
        timeline: number;
        spokenLanguage: string;
        finance: string;
        buyerType: string;
      }
    >({
      invalidatesTags: ["Lead"],
      query: ({ leadId, ...body }) => ({
        url: `leads/${leadId}/qualification`,
        method: "PUT",
        body,
      }),
    }),
    createLead: builder.mutation<
      Lead,
      {
        title: string;
        name: string;
        mobileNumber: string;
        phoneNumber: string;
        email: string;
        nationalityId: string;
        language: string;
        type: string;
        sourceId: string;
        subsource: string;

        listingId: string;

        cityId: string;
        communityId: string;
        subcommunityId: string;
        propertyId: string;
        categoryId: string;

        minBedrooms: number;
        maxBedrooms: number;
        minPrice: number;
        maxPrice: number;
        minArea: number;
        maxArea: number;
      }
    >({
      invalidatesTags: ["Lead"],
      query: (body) => ({
        url: `leads`,
        method: "POST",
        body,
      }),
    }),
    updateLeadContact: builder.mutation<
      LeadContact,
      {
        leadId: string;
        channel?: string;
        response?: string;
        contactable?: boolean;
      }
    >({
      invalidatesTags: ["Lead", "LeadContact"],
      query: ({ leadId, ...body }) => ({
        url: `leads/${leadId}/contact`,
        method: "PATCH",
        body,
      }),
    }),
    updateFeedback: builder.mutation<
      Feedback,
      Omit<Feedback, "createdAt" | "updatedAt" | "id"> & { leadId: string }
    >({
      invalidatesTags: ["Lead"],
      query: ({ leadId, viewingId, ...body }) => ({
        url: `leads/${leadId}/viewings/${viewingId}/feedback`,
        method: "PUT",
        body,
      }),
    }),
    holdUser: builder.mutation<User, string>({
      invalidatesTags: ["User"],
      query: (userId) => ({
        url: `users/${userId}/hold`,
        method: "PATCH",
      }),
    }),
    getCampaigns: builder.query<
      { total: number; data: Campaign[] },
      {
        page?: string;
        pageSize?: string;
        search?: string;
        include?: string;
      }
    >({
      providesTags: ["Campaign"],
      query: (params) => ({
        url: `campaigns`,
        params,
      }),
    }),
    deleteCampaign: builder.mutation<void, string>({
      invalidatesTags: ["Campaign"],
      query: (campaignId) => ({
        url: `campaigns/${campaignId}`,
        method: "DELETE",
      }),
    }),
    getCampaign: builder.query<Campaign, string>({
      providesTags: ["Campaign"],
      query: (campaignId) => ({
        url: `campaigns/${campaignId}`,
      }),
    }),
    getTeams: builder.query<
      { total: number; data: Team[] },
      {
        page?: string;
        pageSize?: string;
        search?: string;
        include?: string;
        flat?: boolean;
      }
    >({
      providesTags: ["Team"],
      query: (params) => ({
        url: `teams`,
        params,
      }),
    }),
    getTeam: builder.query<
      Team & { users: Pick<User, "name" | "id">[] },
      { id: string; include?: string }
    >({
      providesTags: ["Team"],
      query: ({ id, ...params }) => ({
        url: `teams/${id}`,
        params,
      }),
    }),
    deleteTeam: builder.mutation<void, string>({
      invalidatesTags: ["Team"],
      query: (teamId) => ({
        url: `teams/${teamId}`,
        method: "DELETE",
      }),
    }),
    createCampaign: builder.mutation<
      Campaign,
      { name: string; sourceId: string; teamId: string }
    >({
      invalidatesTags: ["Campaign"],
      query: (body) => ({
        url: `campaigns`,
        method: "POST",
        body,
      }),
    }),
    updateCampaign: builder.mutation<
      Campaign,
      { id: string; name: string; sourceId: string; teamId: string }
    >({
      invalidatesTags: ["Campaign"],
      query: ({ id, ...body }) => ({
        url: `campaigns/${id}`,
        method: "PUT",
        body,
      }),
    }),
    createTeam: builder.mutation<Team, { name: string; users: string[] }>({
      invalidatesTags: ["Team"],
      query: (body) => ({
        url: `teams`,
        method: "POST",
        body,
      }),
    }),
    updateTeam: builder.mutation<
      Team,
      { id: string; name: string; users: string[] }
    >({
      invalidatesTags: ["Team"],
      query: ({ id, ...body }) => ({
        url: `teams/${id}`,
        method: "PUT",
        body,
      }),
    }),
    pickUpLead: builder.mutation<unknown, string>({
      invalidatesTags: ["Lead"],
      query: (id) => ({
        url: `leads/pool/${id}/pick-up`,
        method: "PATCH",
      }),
    }),
    getDeals: builder.query<
      { total: number; data: Deal[] },
      {
        page?: string;
        pageSize?: string;
        include?: string;
      }
    >({
      providesTags: ["Deal"],
      query: (params) => ({
        url: `deals`,
        params,
      }),
    }),
  }),
});

export const {
  useGetCitiesQuery,
  useGetCommunitiesQuery,
  useGetSubcommunitiesQuery,
  useGetPropertiesQuery,
  useCreateListingMutation,
  useGetContactsQuery,
  useCreateContactMutation,
  useGetCommonQuery,
  useGetListingsQuery,
  useDeleteListingMutation,
  useGetListingQuery,
  useUpdateListingMutation,
  useCreatePhotoRequestMutation,
  useGetPhotoRequestsQuery,
  useGetPhotoRequestQuery,
  useGetUsersQuery,
  useApprovePhotoRequestMutation,
  useGetPhotoshootsQuery,
  useGetPhotographersQuery,
  useGetPhotoEditorsQuery,
  useAssignPhotoshootMutation,
  useSubmitPhotoshootMutation,
  useUploadPhotoshootImagesMutation,
  useApprovePhotoshootMutation,
  usePublishListingMutation,
  useCreateExtensionRequestMutation,
  useGetExtensionRequestsQuery,
  useGetExtensionRequestQuery,
  useApproveExtensionRequestMutation,
  useRejectExtensionRequestMutation,
  useCreateUnpublishRequestMutation,
  useGetUnpublishRequestsQuery,
  useCancelUnpublishRequestMutation,
  useGetUnpublishRequestQuery,
  useRejectUnpublishRequestMutation,
  useApproveUnpublishRequestMutation,
  useArchiveListingMutation,
  useGetProfileQuery,
  useSignInMutation,
  useLogoutMutation,
  useCancelPhotoRequestMutation,
  useRejectPhotoRequestMutation,
  useUploadListingDocumentMutation,
  useRepublishListingMutation,
  useCreateUserMutation,
  useDeleteUserMutation,
  useReAssignPhotoshootMutation,
  useDeleteImageMutation,
  useUpdateProfilePasswordMutation,
  useUpdateUserMutation,
  useUpdateProfileMutation,
  useUpdateProfileImageMutation,
  useGetLeadsQuery,
  useCreateLeadMutation,
  useApproveLeadMutation,
  useRejectLeadMutation,
  useApproveLeadExtensionRequestMutation,
  useRejectLeadExtensionRequestMutation,
  useGetLeadExtensionRequestsQuery,
  useGetLeadQuery,
  useCreateViewingMutation,
  useCreateOfferMutation,

  useAcceptOfferMutation,
  useRejectOfferMutation,
  useNegotiateOfferMutation,
  useConvertOfferMutation,

  useUpdateQualificationMutation,
  useUpdateLeadContactMutation,
  useUpdateFeedbackMutation,

  useHoldUserMutation,

  useGetCampaignsQuery,
  useLazyGetCampaignQuery,
  useGetCampaignQuery,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
  useCreateCampaignMutation,

  useGetTeamsQuery,
  useGetTeamQuery,
  useLazyGetTeamQuery,
  useDeleteTeamMutation,
  useCreateTeamMutation,
  useUpdateTeamMutation,

  useLazyGetListingQuery,

  useGetLeadsPoolQuery,
  useGetViewingsQuery,
  useGetOffersQuery,
  useGetLeadContactsQuery,

  useCancelViewingMutation,

  usePickUpLeadMutation,

  useCreateLeadExtensionRequestMutation,
  useGetDealsQuery,
} = api;
