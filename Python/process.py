#!/usr/bin/env python
# coding: utf-8

# In[1]:


from google.refine import refine, facet
import pystache
import numpy as np
import pandas as pd
from textpack import tp
from sqlalchemy import create_engine
engine = create_engine('sqlite://', echo=False)


# In[2]:


df = pd.read_csv('Documents/UIUC/CS498/Final_Project/MilanoTelecom/data/Airbnb_Listings.csv', index_col='id',encoding='latin1')


# In[ ]:





# In[3]:


df.to_sql('Listing', con=engine)


# In[4]:


engine.execute("SELECT * FROM Listing limit 5").fetchall()


# In[5]:


df2 = pd.read_sql_query("SELECT host_since FROM Listing", engine)
# df2.to_csv('host_since.csv', index=False)


# In[6]:


#increase in each year
engine.execute("with temp(type, year, number) as "
               "( SELECT room_type, strftime('%Y', host_since) as host_since, count(*) as count FROM Listing "
               "where host_since is not null group by room_type, strftime('%Y', host_since))  select * from temp").fetchall()


# In[7]:


#Cummulative listing for each type
df3 = pd.read_sql_query("with temp(type, year, number) as "
               "( SELECT room_type, strftime('%Y', host_since) as host_since, count(*) as count FROM Listing"
               " where host_since is not null group by room_type, strftime('%Y', host_since)) "
               "select a.type , a.year , sum(b.number) from temp as a join temp as b "
               "where a.type=b.type and a.year>=b.year group by a.type, a.year", engine)


# In[8]:


#increase in each year
engine.execute("with temp(type, year, number) as "
               "( SELECT room_type, strftime('%Y', host_since) as host_since, count(*) as count FROM Listing"
               " where host_since is not null group by room_type, strftime('%Y', host_since)) "
               "select a.type , a.year , sum(b.number) from temp as a join temp as b "
               "where a.type=b.type and a.year>=b.year group by a.type, a.year").fetchall()


# In[9]:


df3.to_csv('host_since.csv', index=False)


# In[10]:


#avg price, room, city, join since
df4=pd.read_sql_query("SELECT  city, round(avg(trim(price, '$')),2) as avg_price, round(avg(bedrooms),2) as avg_num_bedrooms, "
                   "count(distinct id) as number_listing FROM Listing where city is not null group by city  ", engine)


# In[11]:


df4


# In[12]:


#increase in each year
engine.execute("SELECT  city, round(avg(trim(price, '$')),2) as avg_price, round(avg(bedrooms),2) as avg_num_bedrooms, "
                   "count(id) as number_listing FROM Listing where city is not null group by city  ").fetchall()


# In[13]:


df4.to_csv('avg_price_bedrooms.csv', index=False)


# In[14]:


engine.execute('''PRAGMA table_info(Listing);''').fetchall()


# In[31]:


#increase in each year
engine.execute("SELECT  city, round(trim(price, '$'),2) as price FROM Listing where round(trim(price, '$'),2) >0 and city is not null order by round(trim(price, '$'),2)  ").fetchall()


# In[32]:


df5=pd.read_sql_query("SELECT  city, round(trim(price, '$'),2) as price FROM Listing where round(trim(price, '$'),2) >0 and city is not null order by round(trim(price, '$'),2) ", engine)


# In[34]:


df5.to_csv('price.csv', index=False)


# In[ ]:




