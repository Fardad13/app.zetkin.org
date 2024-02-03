import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ZetkinCampaign } from 'utils/types/zetkin';
import { remoteItem, RemoteList, remoteList } from 'utils/storeUtils';

export interface CampaignsStoreSlice {
  campaignList: RemoteList<ZetkinCampaign>;
  recentlyCreatedCampaign: ZetkinCampaign | null;
}

const initialCampaignsState: CampaignsStoreSlice = {
  campaignList: remoteList(),
  recentlyCreatedCampaign: null,
};

const campaignsSlice = createSlice({
  initialState: initialCampaignsState,
  name: 'campaigns',
  reducers: {
    campaignCreate: (state) => {
      state.campaignList.isLoading = true;
      state.recentlyCreatedCampaign = null;
    },
    campaignCreated: (state, action: PayloadAction<ZetkinCampaign>) => {
      const campaign = action.payload;
      state.campaignList.isLoading = false;
      state.campaignList.items.push(
        remoteItem(campaign.id, { data: campaign })
      );
      state.recentlyCreatedCampaign = campaign;
    },
    campaignDeleted: (
      state,
      action: PayloadAction<[orgId: number, campaignId: number]>
    ) => {
      const campaignId = action.payload[1];
      state.campaignList.items = state.campaignList.items.filter(
        (item) => item.id != campaignId
      );
    },
    campaignLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const item = state.campaignList.items.find((item) => item.id == id);
      state.campaignList.items = state.campaignList.items
        .filter((item) => item.id != id)
        .concat([remoteItem(id, { data: item?.data, isLoading: true })]);
    },
    campaignLoaded: (state, action: PayloadAction<ZetkinCampaign>) => {
      const id = action.payload.id;
      const item = state.campaignList.items.find((item) => item.id == id);

      if (!item) {
        throw new Error(
          'Finished loading something that never started loading'
        );
      }

      item.data = action.payload;
      item.loaded = new Date().toISOString();
      item.isLoading = false;
      item.isStale = false;
    },
    campaignUpdate: (state, action: PayloadAction<[number, string[]]>) => {
      const [id, attributes] = action.payload;
      const item = state.campaignList.items.find((item) => item.id == id);

      if (item) {
        item.mutating = item.mutating
          .filter((attr) => !attributes.includes(attr))
          .concat(attributes);
      }
    },
    campaignUpdated: (state, action: PayloadAction<ZetkinCampaign>) => {
      const campaign = action.payload;
      const item = state.campaignList.items.find(
        (item) => item.id == campaign.id
      );

      if (item) {
        item.data = { ...item.data, ...campaign };
        item.mutating = [];
      }
    },
    campaignsLoad: (state) => {
      state.campaignList.isLoading = true;
    },
    campaignsLoaded: (state, action: PayloadAction<ZetkinCampaign[]>) => {
      const campaigns = action.payload;
      const timestamp = new Date().toISOString();

      state.campaignList = remoteList(campaigns);
      state.campaignList.loaded = timestamp;
      state.campaignList.items.forEach((item) => (item.loaded = timestamp));
    },
  },
});

export default campaignsSlice;
export const {
  campaignCreate,
  campaignCreated,
  campaignDeleted,
  campaignLoad,
  campaignLoaded,
  campaignUpdate,
  campaignUpdated,
  campaignsLoad,
  campaignsLoaded,
} = campaignsSlice.actions;
