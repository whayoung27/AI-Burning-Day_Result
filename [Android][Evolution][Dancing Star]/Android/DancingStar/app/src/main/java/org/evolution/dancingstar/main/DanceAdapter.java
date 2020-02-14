package org.evolution.dancingstar.main;

import android.support.annotation.NonNull;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import org.evolution.dancingstar.R;

import java.util.ArrayList;

public class DanceAdapter extends RecyclerView.Adapter<DanceAdapter.DanceListView> {

    private ArrayList<Dance> mDanceList = new ArrayList<>();
    private TextView tvTitle,tvArtist;
    private OnItemClickListener listener = null;

    DanceAdapter(){}

    public DanceAdapter(ArrayList<Dance> list){
        mDanceList = list;
    }

    @NonNull
    @Override
    public DanceListView onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
        View view = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.item_main_dance,viewGroup,false);
        return new DanceListView(view);
    }

    @Override
    public void onBindViewHolder(@NonNull DanceListView danceListView, int i) {
        Dance dance = mDanceList.get(i);
        tvTitle.setText(dance.getTitle());
        tvArtist.setText(dance.getArtist());
    }

    public class DanceListView extends RecyclerView.ViewHolder {

        public DanceListView(@NonNull View itemView) {
            super(itemView);

            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    int pos = getAdapterPosition();
                    if(pos!=RecyclerView.NO_POSITION){
                        if(listener!=null){
                            listener.onItemClick(v,pos);
                        }
                    }
                }
            });
            tvTitle = itemView.findViewById(R.id.item_dance_tv_title);
            tvArtist = itemView.findViewById(R.id.item_dance_tv_artist);
        }
    }

    public interface OnItemClickListener{
        void onItemClick(View v, int pos);
    }

    public void setOnItemClickListener(OnItemClickListener listener){
        this.listener = listener;
    }

    @Override
    public int getItemCount() {
        return mDanceList.size();
    }

}
