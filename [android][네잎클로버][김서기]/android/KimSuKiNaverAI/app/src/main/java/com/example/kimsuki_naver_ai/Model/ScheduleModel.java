package com.example.kimsuki_naver_ai.Model;

public class ScheduleModel {
    private int id;
    private String createdAt;
    private String phoneNumber;
    private String sch_t;
    private String sch_d;
    private String sch_p;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getSch_t() {
        return sch_t;
    }

    public void setSch_t(String sch_t) {
        this.sch_t = sch_t;
    }

    public String getSch_d() {
        return sch_d;
    }

    public void setSch_d(String sch_d) {
        this.sch_d = sch_d;
    }

    public String getSch_p() {
        return sch_p;
    }

    public void setSch_p(String sch_p) {
        this.sch_p = sch_p;
    }
}
