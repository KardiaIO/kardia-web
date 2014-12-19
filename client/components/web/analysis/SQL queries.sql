
use SampleData

alter table SampleData.dbo.SampleEKG
alter column x int not null

alter table SampleData.dbo.SampleEKG
alter column y float not null

alter table SampleData.dbo.SampleEKG
alter column maxIndicator int not null

alter table SampleData.dbo.SampleEKG
add primary key (x)

create index xIndex on SampleData.dbo.SampleEKG (x)

select * from SampleData.dbo.SampleEKG
where maxIndicator = 1

update SampleData.dbo.SampleEKG
set maxIndicator = 0
where x in (348, 2952, 4424, 5216, 10124, 12176)

insert into SampleData.dbo.SampleEKG with (tablock)(x, y, maxIndicator)
select x + b.maxVal + 4, y, maxIndicator
from SampleData.dbo.SampleEKG a
cross join (select max(x) as maxVal from SampleData.dbo.SampleEKG) b

select count(*) from SampleData.dbo.SampleEKG

select * from SampleData.dbo.sampleEKG where x >= 0 and x < 30000 and (x % 8 = 0 or maxIndicator = 1)

select min(y), max(y) from SampleEKG where x < 5000000

select ROW_NUMBER() over (ORDER BY x) as row, * 
into SampleData.dbo.SamplePeaks
from SampleData.dbo.SampleEKG
where maxIndicator = 1

select a.x, a.y, a.x - b.x as interval
into SampleData.dbo.SamplePeakIntervals
from SampleData.dbo.SamplePeaks a
join SampleData.dbo.SamplePeaks b
  on a.row = b.row + 1
where a.x - b.x > 300
order by a.row

select top 24 interval from SampleData.dbo.SamplePeakIntervals
where x > 2376

select distinct top 15  a.interval as x, b.interval as y
from 
  (
  select ROW_NUMBER() OVER (ORDER BY X) as row, * 
  from SampleData.dbo.SamplePeakIntervals
  ) a
join 
  (
  select ROW_NUMBER() OVER (ORDER BY X) as row, * 
  from SampleData.dbo.SamplePeakIntervals
  ) b
  on a.row = b.row - 1
order by 1